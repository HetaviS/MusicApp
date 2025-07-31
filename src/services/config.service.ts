import { Config } from "../models";

async function createConfig(payload: any): Promise<any> {
  try {
    let config = await Config.findOne();
    if (config) return config.toJSON();
    config = await Config.create(payload);
    return config.toJSON();
  } catch (err) {
    throw err;
  }
}

async function getConfig(): Promise<any> {
  try {
    const config = await Config.findOne();
    return config?.toJSON();
  } catch (err) {
    throw err;
  }
}

async function updateConfig(payload: any): Promise<any> {
  try {
    const config = await Config.update(payload, {
      where: { config_id: 1 },
      returning: true,
    });
    if (config[1].length <= 0) return null;
    return config[1][0].toJSON();
  } catch (err) {
    throw err;
  }
}

export default { getConfig, updateConfig, createConfig };
