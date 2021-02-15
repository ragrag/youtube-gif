import { NextFunction, Request, Response } from 'express';
import ytdl from 'ytdl-core';

async function videoCheckMiddleware(req: Request, res: Response, next: NextFunction) {
  const info = await ytdl.getInfo(req.body.youtubeUrl.split('v=')[1]?.slice(0, 11));
  if (Number(info?.videoDetails?.lengthSeconds) > 480) return res.status(400).json({ message: 'Video too long, must be less than 8 minutes' });
  next();
}
export default videoCheckMiddleware;
