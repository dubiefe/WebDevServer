// src/controllers/client.controller.js
import User from "../models/user.model.js";
import Company from "../models/company.model.js";
import Address from "../models/address.model.js";
import Client from "../models/client.model.js";
import { handleHttpError } from '../middleware/error.middleware.js';

// 1) POST /api/client
export const createClient = async (req, res) => {
  try {
    const user = req.user;
    
    // Get user data
    const userData = await User.findById(user._id);

    // Check if no client has same cif in the company
    const clientSameCIFInCompany = await Client.findOne({ cif: req.body.cif, company: userData.company })

    if(clientSameCIFInCompany) {
        handleHttpError(res, 'CLIENT_ALREADY_EXISTS_IN_COMPANY', 409);
        return;
    } else if (!userData.company) {
        handleHttpError(res, 'NO_COMPANY_LINKED_TO_THE_USER', 409);
        return;
    } else {
        // Check if the address exists
        let address = await Address.findOne({
            street: req.body.address.street,
            number: req.body.address.number,
            postal: req.body.address.postal,
            city: req.body.address.city,
            province: req.body.address.province
        });
        // If the address doesn't exists, we create it
        if (!address) {
            address = await Address.create(req.body.address);
        }
        const body = { ...req.body, address: address._id, user: userData._id, company: userData.company };
        const newClient = await Client.create(body);

        return res.status(200).json({ message: 'Client created', content: newClient });
    }

  } catch (error) {
    handleHttpError(res, 'ERROR_CREATING_CLIENT', 409);
    return;
  }
};

// 2) PUT /api/client/:id
export const updateClient = async(req, res) => {
  try {
    const user = req.user;
    const client_id = req.params.id;

    const updatedClient = await Client.findByIdAndUpdate(client_id, {...req.body, updatedAt: Date.now()}, { new: true });

    res.status(200).json({ message: 'Client data updated', content: updatedClient });
    
  } catch (error) {
    handleHttpError(res, 'ERROR_UPDATING_CLIENT_DATA', 409);
    return;
  }
}

// 3) GET /api/client
export const getAllClient = async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user._id)

    let query;

    const { page, limit, name, sort } = req.query;

    const filter = {company: userData.company, deleted: false};
    if(name) { filter.name = name; } 
    query = Client.find(filter)

    if(sort) {
        query.sort(sort)
    } 

    let totalPages, totalItems;
    if(page && limit) {
        // Search complementary result params
        totalItems = await Client.countDocuments(filter)
        totalPages = Math.ceil(totalItems / limit);
        // Search the result
        const offset = (page - 1) * limit;
        query.skip(offset).limit(parseInt(limit))
    }

    const clients = await query

    if(page && limit) {
        return res.status(200).json({totalPages: totalPages, totalItems: totalItems, currentPage: page, content: clients});
    } else {
        return res.status(200).json(clients);
    }

  } catch (error) {
    handleHttpError(res, 'ERROR_GETTING_ALL_CLIENTS', 409);
    return;
  }
};

// 4) GET /api/client/:id
export const getClient = async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user._id)

    const client_id = req.params.id;

    const client = await Client.findById(client_id)

    if(client && client.company.equals(userData.company) && !client.deleted) {
        return res.status(200).json(client);
    } else if (client && !client.company.equals(userData.company)) {
        handleHttpError(res, 'CLIENT_NOT_IN_COMPANY', 409);
        return;
    } else {
        handleHttpError(res, 'CLIENT_NOT_FOUND', 404);
        return;
    }

  } catch (error) {
    handleHttpError(res, 'ERROR_GETTING_CLIENT', 409);
    return;
  }
};

// 5) DELETE /api/client/:id
export const deleteClient = async(req, res) => {
  try {
    const user = req.user
    const { soft } = req.query;

    const client_id = req.params.id;

    if(soft) { // soft delete
      const deletedClient = await Client.findByIdAndUpdate(client_id, {deleted:true});
      res.json({ message: 'Client deleted (soft)', content: deletedClient });
    } else {
      const deletedClient = await Client.findByIdAndDelete(client_id);
      res.json({ message: 'Client deleted permanently', content: deletedClient });
    }
      
  } catch (error) {
    handleHttpError(res, 'ERROR_DELETE_CLIENT', 409);
    return;
  }
}

// 6) GET /api/client/archived
export const getAllArchivedClients = async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user._id)

    const clients = await Client.find({company: userData.company, deleted: true})

    return res.status(200).json(clients);

  } catch (error) {
    handleHttpError(res, 'ERROR_GETTING_ALL_ARCHIVED_CLIENTS', 409);
    return;
  }
};

// 7) PATCH /api/client/:id/restore
export const restoreClient = async (req, res) => {
  try {
    const user = req.user;
    const client_id = req.params.id;

    const restoredClient = await Client.findByIdAndUpdate(client_id, {updatedAt: Date.now(), deleted:false}, { new: true });

    return res.status(200).json(restoreClient);

  } catch (error) {
    handleHttpError(res, 'ERROR_RESTORING_CLIENT', 409);
    return;
  }
};