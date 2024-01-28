import express from "express"
import User from "../../model/User"

const profileRouter = express.Router()

profileRouter.patch("/update", async (req, res) => {

    const profile = await User.updateOne({ _id: req.body._id }, {
        profilePicture: req.body.profilePicture,
    })

    if (!profile) {
        return res.status(400).json({ message: "Profile not found" })
    }
    return res.status(200).json({ message: "Profile updated" })
})

export default profileRouter