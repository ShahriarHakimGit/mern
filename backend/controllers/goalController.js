const asyncHandler = require("express-async-handler");


// GET /api/goals
const getGoals = asyncHandler(async (req, res) => {
    res.status(200).json({message: 'Get goals'});
})

// POST /api/goals
const setGoals = asyncHandler(async (req, res) => {
    if(!req.body.text){
        res.status(400);
        throw new Error('Please add a text field');
    }
    res.status(200).json({message: 'set goals'});
})

//PUT /api/goals/id
const updateGoals = asyncHandler(async(req, res) => {
    res.status(200).json({message: `update goals ${req.params.id}`});
})

//DELETE /api/goals/id
const deleteGoals = asyncHandler(async(req, res) => {
    res.status(200).json({message: `delete goals ${req.params.id}`});
})


module.exports = {
    getGoals,
    setGoals,
    updateGoals,
    deleteGoals,
}