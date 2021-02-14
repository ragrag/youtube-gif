// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

console.log("Ass");
export default (req, res) => {
  console.log("SADAS");
  res.status(200).json({ name: "John Doe" });
};
