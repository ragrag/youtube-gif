export default interface Job {
  id: string;
  youtubeUrl: string;
  youtubeId: string;
  gifUrl: string;
  startTime: number;
  endTime: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
