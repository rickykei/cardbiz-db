const db = require("../models");
const VcfCounter = db.vcf_counter;
 
// Find vcfCounter code list
exports.getVcfCount = (req, res) => {
  VcfCounter.aggregate([
	{
	  $group:{
			_id: {staff_id: "$staff_id",
			      year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
				},
        count:{$sum:1}
			}
	  }
	  
  ])
    .then((data) => {
		  res.send(data);
      console.log("getVcfCounter success");
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving vcfCounter."
      });
    });
};
