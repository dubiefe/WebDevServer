// src/controllers/deliveryNote.controller.js
import User from "../models/user.model.js";
import Company from "../models/company.model.js";
import Address from "../models/address.model.js";
import Client from "../models/client.model.js";
import Project from "../models/project.model.js";
import DeliveryNote from "../models/deliveryNote.model.js";
import { handleHttpError } from '../middleware/error.middleware.js';

// ### Delivery Notes (2 points)

// | Method  |           Endpoint            |          Description          |
// |---------|-------------------------------|-------------------------------|
// | POST    | `/api/deliverynote`           | Create a delivery note        |
// | GET     | `/api/deliverynote`           | List delivery notes           |
// | GET     | `/api/deliverynote/:id`       | Get a specific delivery note  |
// | GET     | `/api/deliverynote/pdf/:id`   | Download delivery note as PDF |
// | PATCH   | `/api/deliverynote/:id/sign`  | Sign a delivery note          |
// | DELETE  | `/api/deliverynote/:id`       | Delete a delivery note        |

// Technical specifications:

// - **Create** (`POST /api/deliverynote`):
//   - The note belongs to a specific project.
//   - Can be of type `material` (delivered materials) or `hours` (hours worked).
//   - Can be simple (single entry) or contain multiple workers/hours and materials.

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

// - **List** (`GET /api/deliverynote`): implement **pagination** and **filters**:
//   - Pagination: `?page=1&limit=10` (also return `totalPages`, `totalItems`, `currentPage`).
//   - Filters: `?project=<projectId>`, `?client=<clientId>`, `?format=hours`, `?signed=true`, `?from=2025-01-01&to=2025-12-31`, `?sort=-workDate`.

// 3) GET /api/deliverynote
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

// - **Get** (`GET /api/deliverynote/:id`):
//   - Use `populate` in Mongoose to include user, client, and project data alongside the delivery note.

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


// - **Download PDF** (`GET /api/deliverynote/pdf/:id`):
//   - Generate the delivery note as a PDF using **pdfkit** (or similar).
//   - The PDF must include user, client, project, and delivery note data (hours or materials), plus the signature if signed.
//   - Only the note's owner or a `guest` of their company may download it.
//   - Return the PDF as a stream (`res.setHeader('Content-Type', 'application/pdf')`).

export const dowloadPDF = async(req, res) => {
  try {
    const user = req.user

    const deliveryNote_id = req.params.id;
      
  } catch (error) {
    handleHttpError(res, 'ERROR_DELETE_DELIVERY_NOTE', 409);
    return;
  }
}

// - **Sign** (`PATCH /api/deliverynote/:id/sign`):
//   - Receives the signature image as a Base64 string in the request body (JSON).
//   - Stores the signature data in the database (`signatureData` field).
//   - Once signed, generates the PDF locally.
//   - A signed delivery note cannot be modified or deleted.

export const sign = async(req, res) => {
  try {
    const user = req.user

    const deliveryNote_id = req.params.id;
      
  } catch (error) {
    handleHttpError(res, 'ERROR_DELETE_DELIVERY_NOTE', 409);
    return;
  }
}

// - **Delete** (`DELETE /api/deliverynote/:id`):
//   - Can only be deleted if the delivery note **is not signed**.

// 4) DELETE /api/deliverynote/:id
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