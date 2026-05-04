// src/controllers/deliveryNote.controller.js
import User from "../models/user.model.js";
import Company from "../models/company.model.js";
import Address from "../models/address.model.js";
import Client from "../models/client.model.js";
import Project from "../models/project.model.js";
import DeliveryNote from "../models/deliveryNote.model.js";
import { handleHttpError } from '../middleware/error.middleware.js';
import { generateDeliveryNotePDF } from "../services/pdf.service.js";
import fs from 'fs';
import path from 'path';

// 1) POST /api/deliverynote
export const createDeliveryNote = async (req, res) => {
  try {
    const user = req.user;
    
    // Get user data
    const userData = await User.findById(user._id);

    // Get project data
    const projectData = await Project.findById(req.body.project)

    if (!userData.company) {
        handleHttpError(res, 'NO_COMPANY_LINKED_TO_THE_USER', 409);
        return;
    } else if(!userData.company.equals(projectData.company)) {
        handleHttpError(res, 'USER_NOT_IN_PROJECT_COMPANY', 409);
        return;
    } else {
        const body = { ...req.body, user: userData._id, company: projectData.company, client: projectData.client };
        const newDeliveryNote = await DeliveryNote.create(body);

        return res.status(200).json({ message: 'Delivery note created', content: newDeliveryNote });
    }

  } catch (error) {
    handleHttpError(res, 'ERROR_CREATING_DELIVERY_NOTE', 409);
    return;
  }
};

// 2) GET /api/deliverynote
export const getAllDeliveryNotes = async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user._id)

    let query;

    const { page, limit, project, client, format, signed, from, to, sort } = req.query;

    const filter = {company: userData.company, deleted: false};
    if(project) { filter.project = project; } 
    if(client) { filter.client = client; } 
    if(format) { filter.format = format; } 
    if(signed) { filter.signed = signed; } 
    if (from) { filter.createdAt.$gte = new Date(from); }
    if (to) { filter.createdAt.$lte = new Date(to); }
    query = DeliveryNote.find(filter)

    if(sort) {
        query.sort(sort)
    } 

    let totalPages, totalItems;
    if(page && limit) {
        // Search complementary result params
        totalItems = await DeliveryNote.countDocuments(filter)
        totalPages = Math.ceil(totalItems / limit);
        // Search the result
        const offset = (page - 1) * limit;
        query.skip(offset).limit(parseInt(limit))
    }

    const deliveryNotes = await query

    if(page && limit) {
        return res.status(200).json({totalPages: totalPages, totalItems: totalItems, currentPage: page, content: deliveryNotes});
    } else {
        return res.status(200).json(deliveryNotes);
    }

  } catch (error) {
    handleHttpError(res, 'ERROR_GETTING_ALL_DELIVERY_NOTES', 409);
    return;
  }
};

// 3) GET /api/deliverynote/:id
export const getDeliveryNote = async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user._id)

    const deliveryNote_id = req.params.id;

    const deliveryNote = await DeliveryNote.findById(deliveryNote_id).populate("user").populate("client").populate("project")

    if(deliveryNote && deliveryNote.company.equals(userData.company)) {
        return res.status(200).json(deliveryNote);
    } else if (deliveryNote && !deliveryNote.company.equals(userData.company)) {
        handleHttpError(res, 'DELIVERY_NOTE_NOT_IN_COMPANY', 409);
        return;
    } else {
        handleHttpError(res, 'DELIVERY_NOTE_NOT_FOUND', 404);
        return;
    }

  } catch (error) {
    handleHttpError(res, 'ERROR_GETTING_DELIVERY_NOTE', 409);
    return;
  }
};

// 4) GET /api/deliverynote/pdf/:id
export const downloadPDF = async(req, res) => {
  try {
    const user = req.user
    const userData = await User.findById(user._id)

    const deliveryNote_id = req.params.id;
    const deliveryNoteData = await DeliveryNote.findById(deliveryNote_id).populate("client").populate("project").populate("user");

    if (deliveryNoteData && !deliveryNoteData.company.equals(userData.company)) {
        handleHttpError(res, 'DELIVERY_NOTE_NOT_IN_COMPANY', 409);
        return;
    }

    // Store pdf
    const dirPath = path.join(process.cwd(), 'pdfs');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    const fileName = `delivery-note-${deliveryNote_id}.pdf`;
    const filePath = path.join(dirPath, fileName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition',`inline; filename="delivery-note-${deliveryNote_id}.pdf"`);

    // Calling pdf service
    await generateDeliveryNotePDF(deliveryNoteData, { filePath, res });

    // Update pdf path
    await DeliveryNote.findByIdAndUpdate(deliveryNote_id, { pdfPath: filePath, updatedAt: Date.now() });
      
  } catch (error) {
    handleHttpError(res, 'ERROR_CREATING_PDF' + error, 409);
    return;
  }
}

// 5) PATCH /api/deliverynote/:id/sign
export const sign = async(req, res) => {
  try {
    const user = req.user
    const userData = await User.findById(user._id)

    const deliveryNote_id = req.params.id;
    const deliveryNoteData = await DeliveryNote.findById(deliveryNote_id).populate("client").populate("project").populate("user");

    if (deliveryNoteData && !deliveryNoteData.company.equals(userData.company)) {
        handleHttpError(res, 'DELIVERY_NOTE_NOT_IN_COMPANY', 409);
        return;
    } else if (deliveryNoteData.signed) {
        handleHttpError(res, 'DELIVERY_NOTE_ALREADY_SIGNED', 409);
        return;
    }

    // Store signature in DB
    deliveryNoteData.signatureData = req.body.signature;
    deliveryNoteData.signed = true;
    deliveryNoteData.signedAt = Date.now();
    deliveryNoteData.updatedAt = Date.now();
    await deliveryNoteData.save();

    // Store pdf
    const dirPath = path.join(process.cwd(), 'pdfs');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    const fileName = `delivery-note-${deliveryNote_id}.pdf`;
    const filePath = path.join(dirPath, fileName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition',`inline; filename="delivery-note-${deliveryNote_id}.pdf"`);

    // Generate PDF
    await generateDeliveryNotePDF(deliveryNoteData, { filePath, res });

    // Update pdf path
    await DeliveryNote.findByIdAndUpdate(deliveryNote_id, { pdfPath: filePath, updatedAt: Date.now() });
      
  } catch (error) {
    handleHttpError(res, 'ERROR_DELETE_DELIVERY_NOTE', 409);
    return;
  }
}

// 6) DELETE /api/deliverynote/:id
export const deleteDeliveryNote = async(req, res) => {
  try {
    const user = req.user

    const deliveryNote_id = req.params.id;

    const deliveryNoteData = await DeliveryNote.findById(deliveryNote_id);

    if (!deliveryNoteData.signed) {
      const deletedDeliveryNote = await DeliveryNote.findByIdAndDelete(deliveryNote_id);
      res.json({ message: 'Delivery note deleted', content: deletedDeliveryNote });
    } else {
        handleHttpError(res, 'SIGNED_DELIVERY_NOTES_CAN_NOT_BE_DELETED', 409);
        return;
    }
      
  } catch (error) {
    handleHttpError(res, 'ERROR_DELETE_DELIVERY_NOTE', 409);
    return;
  }
}