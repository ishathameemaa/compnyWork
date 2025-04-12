import mongoose from "mongoose";
import dbConnect from "./dbConnect";

const NewsSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "Latest",
        "Current Affairs",
        "Trending",
        "History",
        "Entertainment",
        "Volunteering",
        "Events/ Programmes",
      ],
    },
    title: { type: String },
    content: { type: String },
    media: { type: String },
    status: {
      type: String,
      enum: ["published", "unpublished"],
      default: "unpublished",
    },
    pdf: { type: String },
  },
  { timestamps: true }
);

module.exports = async (req, res) => {
  const { collections, id } = req.query;

  if (!collections) {
    return res.status(400).json({ message: "project name is required" });
  }

  await dbConnect(collections); // This connects to the right DB

  // Create or reuse model on the correct connection
  const News = mongoose.models.News || mongoose.model("News", NewsSchema);

  if (req.method === "POST") {
    try {
      const news = new News(req.body);
      const savedNews = await news.save();
      return res.status(201).json(savedNews);
    } catch (error) {
      return res.status(400).json({ message: "Error creating news", error });
    }
  }

  if (req.method === "GET") {
    try {
      const newsList = await News.find().sort({ createdAt: -1 });
      return res.status(200).json(newsList);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching news", error });
    }
  }

  if (req.method === "PUT") {
    try {
      const updatedNews = await News.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedNews) {
        return res.status(404).json({ message: "News not found" });
      }
      return res.status(200).json(updatedNews);
    } catch (error) {
      return res.status(400).json({ message: "Error updating news", error });
    }
  }

  if (req.method === "DELETE") {
    try {
      const deletedNews = await News.findByIdAndDelete(id);
      if (!deletedNews) {
        return res.status(404).json({ message: "News not found" });
      }
      return res.status(200).json({ message: "News deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting news", error });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};
