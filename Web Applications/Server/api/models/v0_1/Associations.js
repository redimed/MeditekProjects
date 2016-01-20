module.exports = {
    associations: function() {
        //association Appointment - TelehealthAppointment
        Appointment.hasOne(TelehealthAppointment, {
            foreignKey: 'AppointmentID'
        });
        TelehealthAppointment.belongsTo(Appointment, {
            foreignKey: 'AppointmentID'
        });

        //association TelehealthAppointment - PatientAppointment
        TelehealthAppointment.hasOne(PatientAppointment, {
            foreignKey: 'TelehealthAppointmentID'
        });
        PatientAppointment.belongsTo(TelehealthAppointment, {
            foreignKey: 'TelehealthAppointmentID'
        });

        //association TelehealthAppointment - ExaminationRequired
        TelehealthAppointment.hasOne(ExaminationRequired, {
            foreignKey: 'TelehealthAppointmentID'
        });

        //association TelehealthAppointment - PreferredPractitioner
        TelehealthAppointment.hasMany(PreferredPractitioner, {
            foreignKey: 'TelehealthAppointmentID'
        });
        PreferredPractitioner.belongsTo(TelehealthAppointment, {
            foreignKey: 'TelehealthAppointmentID'
        });

        //association WAAppointment - PreferredPractitioner
        WAAppointment.hasMany(PreferredPractitioner, {
            foreignKey: 'WAAppointmentID'
        });
        PreferredPractitioner.belongsTo(WAAppointment, {
            foreignKey: 'WAAppointmentID'
        });

        //association TelehealthAppointment - Doctor
        TelehealthAppointment.belongsToMany(Doctor, {
            through: 'RelTelehealthAppointmentDoctor',
            foreignKey: 'TelehealthAppointmentID'
        });
        Doctor.belongsToMany(TelehealthAppointment, {
            through: 'RelTelehealthAppointmentDoctor',
            foreignKey: 'DoctorID'
        });
        //association TelehealthAppointment - ClinicalDetail
        TelehealthAppointment.hasMany(ClinicalDetail, {
            foreignKey: 'TelehealthAppointmentID'
        });
        ClinicalDetail.belongsTo(TelehealthAppointment, {
            foreignKey: 'TelehealthAppointmentID'
        });

        //association Appointment - Doctor
        Appointment.belongsToMany(Doctor, {
            through: 'RelDoctorAppointment',
            foreignKey: 'AppointmentID'
        });
        Doctor.belongsToMany(Appointment, {
            through: 'RelDoctorAppointment',
            foreignKey: 'DoctorID'
        });

        //association Appointment - Patient
        Appointment.belongsToMany(Patient, {
            through: 'RelPatientAppointment',
            foreignKey: 'AppointmentID'
        });
        Patient.belongsToMany(Appointment, {
            through: 'RelPatientAppointment',
            foreignKey: 'PatientID'
        });

        //association Appointment - FileUpload
        Appointment.belongsToMany(FileUpload, {
            through: 'RelAppointmentFileUpload',
            foreignKey: 'AppointmentID'
        });
        FileUpload.belongsToMany(Appointment, {
            through: 'RelAppointmentFileUpload',
            foreignKey: 'FileUploadID'
        });

        //association FileUpload - DocumentFile
        FileUpload.belongsTo(DocumentFile, {
            foreignKey: 'ID'
        });
        FileUpload.hasOne(DocumentFile, {
            foreignKey: 'FileUploadID'
        });

        //association FileUpload - MedicalImage
        FileUpload.belongsTo(MedicalImage, {
            foreignKey: 'ID'
        });
        FileUpload.hasOne(MedicalImage, {
            foreignKey: 'FileUploadID'
        });
        UserAccount.hasMany(FileUpload, {
            foreignKey: 'UserAccountID'
        });
        //association Patient - PatientKin
        Patient.hasOne(PatientKin, {
            foreignKey: 'PatientID'
        });
        PatientKin.belongsTo(Patient, {
            foreignKey: 'PatientID'
        });

        //association Patient - PatientMedicare
        Patient.hasOne(PatientMedicare, {
            foreignKey: 'PatientID'
        });
        PatientMedicare.belongsTo(Patient, {
            foreignKey: 'PatientID'
        });
        //association ClinicalDetail - FileUpload
        ClinicalDetail.belongsToMany(FileUpload, {
            through: 'RelClinicalDetailFileUpload',
            foreignKey: 'ClinicalDetailID'
        });
        FileUpload.belongsToMany(ClinicalDetail, {
            through: 'RelClinicalDetailFileUpload',
            foreignKey: 'FileUploadID'
        });
        //association TelehealthAppointment - WAAppointment
        TelehealthAppointment.hasOne(WAAppointment, {
            foreignKey: 'TelehealthAppointmentID'
        });
        WAAppointment.belongsTo(TelehealthAppointment, {
            foreignKey: 'TelehealthAppointmentID'
        });
        //association Patient - UserAccount
        Patient.belongsTo(UserAccount, {
            foreignKey: 'UserAccountID'
        });

        Doctor.belongsTo(Department, {
            foreignKey: 'DepartmentID'
        });
        Department.hasOne(Doctor, {
            foreignKey: 'DepartmentID'
        });

        //UserAccount
        UserAccount.hasOne(Patient, {
            foreignKey: 'UserAccountID'
        });
        UserAccount.hasMany(UserActivation, {
            foreignKey: 'UserAccountID'
        })

        //Patient - UserAccount
        UserAccount.hasOne(Patient, {
            foreignKey: 'UserAccountID'
        });
        Patient.belongsTo(UserAccount, {
            foreignKey: 'UserAccountID'
        });
        //Patient - Country
        Country.hasOne(Patient, {
            foreignKey: 'CountryID1'
        });
        Patient.belongsTo(Country, {
            foreignKey: 'CountryID1'
        })

        /* Doctor */
        FileUpload.hasOne(Doctor, {
            foreignKey: 'Signature'
        });
        Doctor.belongsTo(FileUpload, {
            foreignKey: 'Signature'
        });
        Country.hasOne(Doctor, {
            foreignKey: 'CountryID'
        });
        Doctor.belongsTo(Country, {
            foreignKey: 'CountryID'
        });
        UserAccount.hasOne(Doctor, {
            foreignKey: 'UserAccountID'
        });
        Doctor.belongsTo(UserAccount, {
            foreignKey: 'UserAccountID'
        });
        /* End Doctor */

        //UserAccount
        UserAccount.hasMany(UserActivation, {
            foreignKey: 'UserAccountID'
        });
        UserActivation.belongsTo(UserAccount, {
            foreignKey: 'UserAccountID'
        })


        UserAccount.hasMany(RelUserRole, {
            foreignKey: 'UserAccountId'
        })
        RelUserRole.belongsTo(UserAccount, {
            foreignKey: 'UserAccountId'
        })
        Role.hasMany(RelUserRole, {
            foreignKey: 'RoleId'
        })
        RelUserRole.belongsTo(Role, {
            foreignKey: 'RoleId'
        })

        Role.belongsToMany(UserAccount, {
            through: 'RelUserRole',
            foreignKey: 'RoleId'
        })
        UserAccount.belongsToMany(Role, {
            through: 'RelUserRole',
            foreignKey: 'UserAccountId'
        })

        Speciality.belongsToMany(Doctor, {
            through: 'RelDoctorSpeciality',
            foreignKey: 'SpecialityID'
        })

        Doctor.belongsToMany(Speciality, {
            through: 'RelDoctorSpeciality',
            foreignKey: 'DoctorID'
        })

        //association Appointment - Consultation
        Appointment.belongsToMany(Consultation, {
            through: 'RelAppointmentConsultation',
            foreignKey: 'AppointmentID'
        });
        Consultation.belongsToMany(Appointment, {
            through: 'RelAppointmentConsultation',
            foreignKey: 'ConsultationID'
        });

        //association Consultation - ConsultationData
        Consultation.belongsToMany(ConsultationData, {
            through: 'RelConsultationData',
            foreignKey: 'ConsultationID'
        });
        ConsultationData.belongsToMany(Consultation, {
            through: 'RelConsultationData',
            foreignKey: 'ConsultationDataID'
        });

        //association ConsultationData - FileUpload
        FileUpload.belongsToMany(ConsultationData, {
            through: 'RelConsultationDataFileUpload',
            foreignKey: 'FileUploadID'
        });
        ConsultationData.belongsToMany(FileUpload, {
            through: 'RelConsultationDataFileUpload',
            foreignKey: 'ConsultationDataID'
        });
        //association Appointment - Admission
        Appointment.belongsToMany(Admission, {
            through: 'RelAppointmentAdmission',
            foreignKey: 'AppointmentID'
        });
        Admission.belongsToMany(Appointment, {
            through: 'RelAppointmentAdmission',
            foreignKey: 'AdmissionID'
        });

        //association Admission - AdmissionData
        Admission.belongsToMany(AdmissionData, {
            through: 'RelAdmissionData',
            foreignKey: 'AdmissionID'
        });
        AdmissionData.belongsToMany(Admission, {
            through: 'RelAdmissionData',
            foreignKey: 'AdmissionDataID'
        });

        //association AdmissionData - FileUpload
        FileUpload.belongsToMany(AdmissionData, {
            through: 'RelAdmissionDataFileUpload',
            foreignKey: 'FileUploadID'
        });
        AdmissionData.belongsToMany(FileUpload, {
            through: 'RelAdmissionDataFileUpload',
            foreignKey: 'AdmissionDataID'
        });

        //association Consultation - FileUpload
        Consultation.belongsToMany(FileUpload, {
            through: 'RelConsultationFileUpload',
            foreignKey: 'ConsultationID'
        });
        FileUpload.belongsToMany(Consultation, {
            through: 'RelConsultationFileUpload',
            foreignKey: 'FileUploadID'
        });

        //association Admission - FileUpload
        Admission.belongsToMany(FileUpload, {
            through: 'RelAdmissionFileUpload',
            foreignKey: 'AdmissionID'
        });
        FileUpload.belongsToMany(Admission, {
            through: 'RelAdmissionFileUpload',
            foreignKey: 'FileUploadID'
        });

        //association Roster - UserAccount
        Roster.belongsToMany(UserAccount, {
            through: 'RelRosterUserAccount',
            foreignKey: 'RosterID'
        });
        UserAccount.belongsToMany(Roster, {
            through: 'RelRosterUserAccount',
            foreignKey: 'UserAccountID'
        });

        //association Roster - Service
        Roster.belongsToMany(Service, {
            through: 'RelRosterService',
            foreignKey: 'RosterID'
        });
        Service.belongsToMany(Roster, {
            through: 'RelRosterService',
            foreignKey: 'ServiceID'
        });
    }
};
