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
    handleHttpError(res, 'ERROR_CREATING_CLIENT' + error, 409);
    return;
  }
};

// 2) PUT /api/client/:id

// 3) GET /api/client
// - **List** (`GET /api/client`): show clients from the user's company. Implement **pagination** and **filters**:
//   - Pagination: `?page=1&limit=10` (also return `totalPages`, `totalItems`, `currentPage`).
//   - Filters: `?name=García` (partial search), `?sort=createdAt` (sorting).

// 3) GET /api/client/:id
// - **Get**: return a specific client belonging to the company.

// 4) DELETE /api/client/:id
// - **Delete**: use the query parameter `?soft=true` to choose deletion type.

// 5) GET /api/client/archived
// - **Archive/Restore**: list soft-deleted clients and allow recovery.

// 6) PATCH /api/client/:id/restore