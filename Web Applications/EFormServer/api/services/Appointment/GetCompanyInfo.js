/**
 * Created by tannvdts on 22/04/2016.
 */
var q = require('q');
module.exports = function (PatientID, AppointmentID)
{
    var result= {};
    var getCompany = function ()
    {
        return Patient.findOne({
            where: {
                ID: PatientID
            },
            attributes: Services.AttributesAppt.Patient(),
            include: [
                {
                    model: Company,
                    attributes: Services.AttributesAppt.Company(),
                    required: false,
                    through: {
                        where: {
                            Active: 'Y'
                        }
                    },
                }
            ]
        })
        .then(function(patient){
            if(patient && patient.Companies[0]) {
                return patient.Companies[0].dataValues;
            } else {
                return null;
            }
        },function(e){
            throw e;
        })
    }

    var getCompanySite = function () {
        return AppointmentData.findOne({
            where: {
                AppointmentID: AppointmentID,
                Name: 'SiteID'
            }
        })
        .then(function(appointmentData){
            if(appointmentData)
            {
                return CompanySite.findOne({
                    where: {
                        ID: appointmentData.Value
                    }
                })
            }
            else {
                return null;
            }

        })
        .then(function(companySite){
            if(companySite)
            {
                return companySite.dataValues;
            }
            else return null;
        })
        .catch(function(e){
            throw e;
        })
    }

    return q.spread([getCompany(),getCompanySite()],function(company, companySite){
        result.company = company;
        result.companySite = companySite;
        return result;
    },function(err){
        throw err;
    })

}