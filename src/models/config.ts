import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

const Config = sequelize.define(
  "Config",
  {
    config_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    app_logo_light: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
      get: function () {
        const raw_urls: string = this.getDataValue("app_logo_light");
        const imageUrls = `${process.env.baseUrl}${raw_urls}`;
        return imageUrls != process.env.baseUrl ? imageUrls : ``;
      },
    },
    app_logo_dark: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
      get() {
        const raw_urls = this.getDataValue("app_logo_dark");
        const imageUrls = `${process.env.baseUrl}${raw_urls}`;
        return imageUrls != process.env.baseUrl ? imageUrls : ``;
      },
    },
    app_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    app_email: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    app_text: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    app_primary_color: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    app_secondary_color: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    app_ios_link: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    app_android_link: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    app_tell_a_friend_text: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    web_logo_light: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
      get() {
        const raw_urls = this.getDataValue("web_logo_light");
        const imageUrls = `${process.env.baseUrl}/${raw_urls}`;
        return imageUrls != process.env.baseUrl ? imageUrls : ``;
      },
    },
    web_logo_dark: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
      get() {
        const raw_urls = this.getDataValue("web_logo_dark");
        const imageUrls = `${process.env.baseUrl}/${raw_urls}`;
        return imageUrls != process.env.baseUrl ? imageUrls : ``;
      },
    },
    email_service: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
      get() {
        const data = this.getDataValue("password");
        if (!data) return "";
        return "*".repeat(data.length);
      },
    },
    email_title: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    copyright_text: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    email_banner: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
      get() {
        const raw_urls = this.getDataValue("email_banner");
        const imageUrls = `${process.env.baseUrl}${raw_urls}`;
        return imageUrls != process.env.baseUrl ? imageUrls : ``;
      },
    },
    privacy_policy: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    terms_and_conditions: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
  },
  {
    tableName: "config",
    timestamps: true,
  }
);

export { Config };
