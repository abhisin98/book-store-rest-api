import { Request, Response } from "express";
import { connectDB, closeDB, IBooks, books } from "@database";

// --------------------------------------------------------------------
export async function GET(req: Request, res: Response) {
  // Allow only GET requests
  if (req.method !== "GET") {
    res.status(405).json({
      error: "Method Not Allowed",
      message: "Only GET requests are allowed.",
    });
    return;
  }

  try {
    await connectDB();
    const result = await books.find().exec();
    await closeDB();

    // Check if data exists before responding
    if (!Array.isArray(result) || result.length === 0) {
      res.status(404).json({
        error: "Not Found",
        message: "No data available.",
      });
      return;
    }

    res.status(200).json(result);
    return;
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later.",
    });
    return;
  }
}

// --------------------------------------------------------------------
export async function POST(req: Request, res: Response) {
  // Allow only POST requests
  if (req.method !== "POST") {
    res.status(405).json({
      error: "Method Not Allowed",
      message: "Only POST requests are allowed.",
    });
    return;
  }

  const { title, author, price, publishedDate } = req.body as IBooks;

  try {
    // Check if input is valid
    if (
      !isValidString(title) ||
      !isValidString(author) ||
      !isValidString(price) ||
      !isValidDate(publishedDate?.toString())
    ) {
      res.status(400).json({
        error: "Bad Request",
        message: "Invalid input data. Please provide a valid input.",
      });
      return;
    }

    // Add new data
    await connectDB();
    const result = await books.create({ title, author, price, publishedDate });
    await closeDB();

    if (!result || !result.id) {
      res.status(400).json({
        error: "Bad Request",
        message: "Failed to create item",
      });
      return;
    }

    res.status(201).json({
      id: result?.id?.toString(),
      message: "Your data has been submitted successfully.",
    });
    return;
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later.",
    });
    return;
  }
}

// --------------------------------------------------------------------
export async function PUT(req: Request, res: Response) {
  // Allow only PUT requests
  if (req.method !== "PUT") {
    res.status(405).json({
      error: "Method Not Allowed",
      message: "Only PUT requests are allowed.",
    });
    return;
  }

  const { id } = req.params as { id: string };
  const { title, author, price, publishedDate } = req.body as IBooks;

  try {
    // Validate input
    if (!id) {
      res.status(400).json({
        error: "Bad Request",
        message: "Invalid input data. Please provide a valid ID.",
      });
      return;
    }

    if (
      (title && !isValidString(title)) ||
      (author && !isValidString(author)) ||
      (price && !isValidString(price)) ||
      (publishedDate && !isValidDate(publishedDate?.toString()))
    ) {
      res.status(400).json({
        error: "Bad Request",
        message: "Invalid input data. Please provide a valid input.",
      });
      return;
    }

    // Find data
    await connectDB();
    const result = await books.findById(id);

    if (!result || !result?.id) {
      res.status(404).json({
        error: "Not Found",
        message: "Data with the specified ID not found.",
      });
      await closeDB();
      return;
    }

    // Update data
    let updateInput: Partial<IBooks> = {};
    if (title) {
      updateInput.title = title;
    }
    if (author) {
      updateInput.author = author;
    }
    if (price) {
      updateInput.price = price;
    }
    if (publishedDate) {
      updateInput.publishedDate = publishedDate;
    }

    const updateResult = await books.updateOne(
      { _id: result?.id },
      updateInput
    );

    if (updateResult?.modifiedCount == 1) {
      res
        .status(200)
        .json({ id, message: "Your data has been updated successfully." });
    } else {
      res.status(400).json({
        error: "Update failed",
        message:
          "No changes were made to your data. Ensure the provided ID and data are correct.",
      });
    }

    await closeDB();
    return;
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later.",
    });
    return;
  }
}

// --------------------------------------------------------------------
export async function DELETE(req: Request, res: Response) {
  // Allow only DELETE requests
  if (req.method !== "DELETE") {
    res.status(405).json({
      error: "Method Not Allowed",
      message: "Only DELETE requests are allowed.",
    });
    return;
  }

  const { id } = req.params as { id: string };

  try {
    // Validate input
    if (!id) {
      res.status(400).json({
        error: "Bad Request",
        message: "Invalid input data. Please provide a valid ID.",
      });
      return;
    }

    // Find and delete data
    await connectDB();
    const result = await books.findByIdAndDelete(id);

    if (!result || !result.id) {
      res.status(404).json({
        error: "Not Found",
        message: "Data with the specified ID not found.",
      });
      await closeDB();
      return;
    }

    await closeDB();
    res
      .status(200)
      .json({ id, message: "Your data has been deleted successfully." });
    return;
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later.",
    });
    return;
  }
}

// --------------------------------------------------------------------
function isValidDate(dateString: any): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()); // Check if it's a valid date
}

// --------------------------------------------------------------------
function isValidString(str: any): boolean {
  return typeof str === "string" && str.trim().length > 0;
}
