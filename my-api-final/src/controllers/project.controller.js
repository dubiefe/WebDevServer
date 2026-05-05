// src/controllers/project.controller.js
import User from "../models/user.model.js";
import Company from "../models/company.model.js";
import Address from "../models/address.model.js";
import Client from "../models/client.model.js";
import Project from "../models/project.model.js";
import { handleHttpError } from '../middleware/error.middleware.js';

// 1) POST /api/project
export const createProject = async (req, res) => {
  try {
    const user = req.user;
    
    // Get user data
    const userData = await User.findById(user._id);

    if (!userData.company) {
        handleHttpError(res, 'NO_COMPANY_LINKED_TO_THE_USER', 409);
        return;
    }

    // Get client data
    let clientData;
    try {
        clientData = await Client.findById(req.body.clientId);
    } catch(e) {
        handleHttpError(res, 'THE_CLIENT_DO_NOT_EXIST', 409);
        return;
    }

    // Check if the client is in the same company than the user
    if(!userData.company.equals(clientData.company)) {
        handleHttpError(res, 'CLIENT_NOT_IN_THE_SAME_COMPANY', 409);
        return;
    }

    // Check if client has same the company
    const projectSameCodeInCompany = await Project.findOne({ projectCode: req.body.projectCode, company: userData.company })

    if(projectSameCodeInCompany) {
        handleHttpError(res, 'PROJECT_CODE_ALREADY_EXISTS_IN_COMPANY', 409);
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
        if (!address) { address = await Address.create(req.body.address); }
        const body = { ...req.body, address: address._id, user: userData._id, company: userData.company, client: clientData._id };
        const newProject = await Project.create(body);

        return res.status(200).json({ message: 'Project created', content: newProject });
    }

  } catch (error) {
    handleHttpError(res, 'ERROR_CREATING_PROJECT', 409);
    return;
  }
};

// 2) PUT /api/project/:id
export const updateProject = async(req, res) => {
  try {
    const user = req.user;
    const project_id = req.params.id;

    const updatedProject = await Project.findByIdAndUpdate(project_id, {...req.body, updatedAt: Date.now()}, { new: true });

    res.status(200).json({ message: 'Project data updated', content: updatedProject });
    
  } catch (error) {
    handleHttpError(res, 'ERROR_UPDATING_PROJECT_DATA', 409);
    return;
  }
}

// 3) GET /api/project
export const getAllProjects = async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user._id)

    let query;

    const { page, limit, client, name, active, sort } = req.query;

    const filter = {company: userData.company, deleted: false};
    if(client) { filter.client = client; } 
    if(name) { filter.name = name; } 
    if(active) { filter.active = active; } 
    query = Project.find(filter)

    if(sort) { query.sort(sort) } 

    let totalPages, totalItems;
    if(page && limit) {
        // Search complementary result params
        totalItems = await Project.countDocuments(filter)
        totalPages = Math.ceil(totalItems / limit);
        // Search the result
        const offset = (page - 1) * limit;
        query.skip(offset).limit(parseInt(limit))
    }

    const projects = await query

    if(page && limit) {
        return res.status(200).json({totalPages: totalPages, totalItems: totalItems, currentPage: page, content: projects});
    } else {
        return res.status(200).json(projects);
    }

  } catch (error) {
    handleHttpError(res, 'ERROR_GETTING_ALL_PROJECTS' + error, 409);
    return;
  }
};

// 4) GET /api/project/:id
export const getProject = async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user._id)

    const project_id = req.params.id;

    const project = await Project.findById(project_id)

    if(project && project.company.equals(userData.company) && !project.deleted) {
        return res.status(200).json(project);
    } else if (project && !project.company.equals(userData.company)) {
        handleHttpError(res, 'PROJECT_NOT_IN_COMPANY', 409);
        return;
    } else {
        handleHttpError(res, 'PROJECT_NOT_FOUND', 404);
        return;
    }

  } catch (error) {
    handleHttpError(res, 'ERROR_GETTING_PROJECT', 409);
    return;
  }
};

// 5) DELETE /api/project/:id
export const deleteProject = async(req, res) => {
  try {
    const user = req.user
    const { soft } = req.query;

    const project_id = req.params.id;

    if(soft) { // soft delete
      const deletedProject = await Project.findByIdAndUpdate(project_id, {deleted:true});
      res.json({ message: 'Project deleted (soft)', content: deletedProject });
    } else {
      const deletedProject = await Project.findByIdAndDelete(project_id);
      res.json({ message: 'Project deleted permanently', content: deletedProject });
    }
      
  } catch (error) {
    handleHttpError(res, 'ERROR_DELETE_PROJECT', 409);
    return;
  }
}

// 6) GET /api/project/archived
export const getAllArchivedProjects = async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user._id)

    const projects = await Project.find({company: userData.company, deleted: true})

    return res.status(200).json(projects);

  } catch (error) {
    handleHttpError(res, 'ERROR_GETTING_ALL_ARCHIVED_PROJECTS', 409);
    return;
  }
};

// 7) PATCH /api/project/:id/restore
export const restoreProject = async (req, res) => {
  try {
    const user = req.user;
    const project_id = req.params.id;

    const restoredProject = await Project.findByIdAndUpdate(project_id, {updatedAt: Date.now(), deleted:false}, { new: true });

    return res.status(200).json(restoredProject);

  } catch (error) {
    handleHttpError(res, 'ERROR_RESTORING_PROJECT', 409);
    return;
  }
};