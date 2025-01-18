import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBWbX3gfIBJVOMFvo0R16TNSJxWxi4JKGM";
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateResponse = async (message) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};
