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
                    include: [
                        {
                            model: CompanySite,
                            required: false,
                        }
                    ]
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
        var CompanySites=_.cloneDeep(company.CompanySites);
        delete company['CompanySites'];
        result.company = company;
        result.companySite = null;
        if(companySite) {
            result.companySite = companySite;
        } else {
            result.companySite = (CompanySites && CompanySites[0])?CompanySites[0].dataValues:null;
        }
        return result;
    },function(err){
        throw err;
    })

}