const News = require("./models/newsModel");
import clientPromise from "./dbConnect";

module.exports = async (req, res) => {
  const {collections, id } = req.query;

  await clientPromise(collections);


  if (!collections) {
    return responseHandler(res,400,"project name is required")
    
  }

  if(req.method === "POST") {
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
