"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static async createPost({ topic, type, keywords, tone, data }) {
      const post = await this.create({
        topic,
        type,
        keywords,
        tone,
        data,
      });
      return post;
    }

    static async getAllPosts() {
      const posts = await this.findAll({
        order: [["createdAt", "DESC"]],
      });
      return posts;
    }
  }
  Post.init(
    {
      topic: DataTypes.TEXT,
      type: DataTypes.STRING,
      keywords: DataTypes.STRING,
      tone: DataTypes.STRING,
      data: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
