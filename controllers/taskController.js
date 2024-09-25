import Task from '../models/task.model'


export const createTask = async (req, res) => {
    try {
        const {title, team, stage, date, priority, assets} = req.body
        const task = await Task.create({
            title, 
            team, 
            stage: stage.toLowerCase(),
            date, 
            priority: priority.toLowerCase(),
            assets
        })
        let text = 'New task has been assigned to you'
        if(task.team.length > 1) {
            text = text + `and ${task.team.length -1} others`
        }
        text = text + `The task priority is set a ${task.priority} priority , so check and act accordingly. The task date is ${task.date.toDateString()}. Thank you!!! `
    } catch (error) {
        console.log(error)
        return res.status(400).json({status: false, message: error.message})
    }
   
}