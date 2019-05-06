const Driver = require('../models/driver');

module.exports = {

    index(req, res, next) {
        const { lng, lat } = req.query;

        Driver.aggregate([{
            $geoNear: {
                near: { 
                     type: "Point", 
                     coordinates: [parseFloat(lng), parseFloat(lat)] 
                },
                distanceField: "dist.calculated",
                maxDistance: 50000,     // Within 50 km
                spherical: true
            }
        }])
        .then(drivers => res.send(drivers))
        .catch(next);
    },

    create(req, res, next) {
        // bodyParser makes request body available
        // as JSON on req.body property
        const driverProps = req.body;

        // Including .catch(next) to trigger our error
        // handling middleware
        Driver.create(driverProps)
            .then(driver => res.send(driver))
            .catch(next);
    },

    update(req, res, next) {
        const driverId = req.params.id;
        const driverProps = req.body;

        Driver.findOneAndUpdate(
                { _id: driverId }, 
                driverProps, 
                { returnNewDocument: true })
            .then(driver => res.send(driver))
            .catch(next);
    },

    delete(req, res, next) {
        const driverId = req.params.id;
        const driverProps = req.body;

        Driver.findOneAndDelete({ _id: driverId })
            .then((driver) => res.status(204).send(driver))
            .catch(next);
    }

};