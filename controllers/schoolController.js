const School = require('../models/schoolModel');
const {calculateDistance} = require('../util/distanceUtil');
const Joi = require('joi');

// Validation schema for adding a school
const schoolSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(255),
  address: Joi.string().required().trim().min(5).max(255),
  latitude: Joi.number().required().min(-90).max(90),
  longitude: Joi.number().required().min(-180).max(180)
});

// Add a new school
exports.addSchool = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = schoolSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid input data',
        details: error.details.map(detail => detail.message)
      });
    }
    
    // Create a new school instance
    const school = new School({
      name: value.name,
      address: value.address,
      latitude: value.latitude,
      longitude: value.longitude
    });
    
    // Save school in the database
    const savedSchool = await School.create(school);
    
    res.status(201).json({
      status: 'success',
      message: 'School added successfully',
      data: savedSchool
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to add school',
      error: err.message
    });
  }
};

// Get all schools sorted by proximity to user location
exports.listSchools = async (req, res) => {
  try {
    // Validate user coordinates
    const latitudeSchema = Joi.number().required().min(-90).max(90);
    const longitudeSchema = Joi.number().required().min(-180).max(180);
    
    const { error: latError } = latitudeSchema.validate(req.query.latitude);
    const { error: lonError } = longitudeSchema.validate(req.query.longitude);
    
    if (latError || lonError) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid coordinates',
        details: [
          latError?.details.map(detail => detail.message),
          lonError?.details.map(detail => detail.message)
        ].filter(Boolean)
      });
    }
    
    // Parse user coordinates
    const userLat = parseFloat(req.query.latitude);
    const userLong = parseFloat(req.query.longitude);
    
    // Get all schools
    const schools = await School.findAll();
    
    // Calculate distance for each school and add it as a property
    const schoolsWithDistance = schools.map(school => {
      const distance = calculateDistance(
        userLat, 
        userLong, 
        school.latitude, 
        school.longitude
      );
      
      return {
        ...school,
        distance: parseFloat(distance.toFixed(2))
      };
    });
    
    // Sort schools by distance (closest first)
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);
    
    res.status(200).json({
      status: 'success',
      message: 'Schools retrieved successfully',
      userLocation: { latitude: userLat, longitude: userLong },
      data: schoolsWithDistance
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve schools',
      error: err.message
    });
  }
};