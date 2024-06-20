import PopupService from "../../services/popup/pupupSerivce";

export default async (req, res) => {
  console.log(`[+] Popup request received:`, req.body);
  if (!req.body) return res.status(400).send({ data: "data is required" });
  const data = req.body.popupsData;
  const script = await PopupService.generatePopupTag(data);

  res.status(200).send(script);
};
