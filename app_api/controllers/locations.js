const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

const locationsListByDistance = async(req, res) => {
    const lng = parseFloat(req.query.lng); //parseFloat - longitude & latitude from string to number//
    const lat = parseFloat(req.query.lat);
    const near = {
        type: "Point",
        coordinates: [lng, lat]
    };
    const geoOptions = {
        distanceField: "distance.calculated",
        key: 'coords',
        spherical: true, //MongoDb will calcualate the distance using spherical geometry//
        maxDistance: 20000, //MongoDb can search restaurants within 20km//
        limit: 10 //MongoDb can search upto 10 nearby restaurants//
    };
    if ((!lng && lng !== 0) || (!lat && lat !== 0)) {
        return res
            .status(404)
            .json({ "message": "lng and lat query parameters are required" });
    }

    try {
        const results = await Loc.aggregate([{
            $geoNear: {
                near,
                ...geoOptions //spread operator//
            }
        }]);
        const locations = results.map(result => {
            return {
                _id: result._id,
                name: result.name,
                address: result.address,
                rating: result.rating,
                cuisines: result.cuisines,
                distance: `${result.distance.calculated.toFixed()}`
            }
        });
        res
            .status(200)
            .json(locations);
    } catch (err) {
        res
            .status(404)
            .json(err);
    }
};

const locationsCreate = (req, res) => {
    Loc.create({
            name: req.body.name,
            address: req.body.address,
            cuisines: req.body.cuisines.split(","),
            coords: [
                parseFloat(req.body.lng),
                parseFloat(req.body.lat)
            ],
            openingTimes: [{
                    days: req.body.days1,
                    opening: req.body.opening1,
                    closing: req.body.closing1,
                    closed: req.body.closed1
                },
                {
                    days: req.body.days2,
                    opening: req.body.opening2,
                    closing: req.body.closing2,
                    closed: req.body.closed2
                }
            ]
        },
        (err, location) => { //callback function//
            if (err) {
                res
                    .status(400)
                    .json(err);
            } else {
                res
                    .status(201)
                    .json(location);
            }
        });
};

const locationsReadOne = (req, res) => {
    Loc
        .findById(req.params.locationid)
        .exec((err, location) => {
            if (!location) {
                return res
                    .status(404)
                    .json({ "message": "location not found" });
            } else if (err) {
                return res
                    .status(404)
                    .json(err);
            } else {
                return res
                    .status(200)
                    .json(location);
            }
        });
};

const locationsUpdateOne = (req, res) => {
    if (!req.params.locationid) {
        return res
            .status(404)
            .json({
                "message": "Not found, locationid is required"
            });
    }
    Loc
        .findById(req.params.locationid)
        .select('-reviews -rating') //Select method with hyphen in pathnames, for not retrieving reviews & rating from DB.//
        .exec((err, location) => {
            if (!location) {
                return res
                    .json(404)
                    .status({
                        "message": "locationid not found"
                    });
            } else if (err) {
                return res
                    .status(400)
                    .json(err);
            }
            location.name = req.body.name;
            location.address = req.body.address;
            location.cuisines = req.body.cuisines.split(',');
            location.coords = [
                parseFloat(req.body.lng),
                parseFloat(req.body.lat)
            ];
            location.openingTimes = [{
                days: req.body.days1,
                opening: req.body.opening1,
                closing: req.body.closing1,
                closed: req.body.closed1,
            }, {
                days: req.body.days2,
                opening: req.body.opening2,
                closing: req.body.closing2,
                closed: req.body.closed2,
            }];
            location.save((err, loc) => {
                if (err) {
                    res
                        .status(404)
                        .json(err);
                } else {
                    res
                        .status(200)
                        .json(loc);
                }
            });
        });
};

const locationsDeleteOne = (req, res) => {
    const { locationid } = req.params;
    if (locationid) {
        Loc
            .findByIdAndRemove(locationid) //finding and removing that data//
            .exec((err, location) => {
                if (err) {
                    return res
                        .status(404)
                        .json(err);
                }
                res
                    .status(204)
                    .json(null);
            });
    } else {
        res
            .status(404)
            .json({
                "message": "No Location"
            });
    }
};

module.exports = {
    locationsListByDistance,
    locationsCreate,
    locationsReadOne,
    locationsUpdateOne,
    locationsDeleteOne
};