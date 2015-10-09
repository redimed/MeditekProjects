var AppointmentServices = {}

AppointmentServices.AppointmentAttributes =['ID','UID','SiteID','FromTime','ToTime','RequestDate','ApprovalDate','Status','Enable']

AppointmentServices.TeleheathAppointmentAttributes = ['ID',
											        'AppointmentID',
											        'Description',
											        'Fund',
											        'Correspondence',
											        'RefName',
											        'RefHealthLink',
											        'RefAddress',
											        'RefTelePhone',
											        'RefPostCode',
											        'RefSignature',
											        'RefDate',
											        'RefProviderNumber',
											        'RefDurationOfReferal',
											   
											        ]
AppointmentServices.PatientAppointmentAttibutes = [
												  	'ID',
											        'UID',
											        'TelehealthAppointmentID',
											        'FirstName',
											        'MiddleName',
											        'LastName',
											        'DOB',
											        'Address',
											        'Suburb',
											        'Postcode',
											        'Email',
											        'PhoneNumber',
											        'HomePhoneNumber',
											      
												  ]
AppointmentServices.ExaminationrequiredAttributes = [
												  	'ID',
											        'TelehealthAppointmentID',
											        'Private',
											        'Public',
											        'DVA',
											        'WorkersComp',
											        'MVIT',
											 
												  ]
AppointmentServices.PreferedPlasticSurgeonAttributes = [
												    'ID',
											        'TelehealthAppointmentID',
											        'Name',
											        ]
AppointmentServices.TelehealthClinicalDetailAttributes = [
													'ID',
											        'TelehealthAppointmentID',
											        'Section',
											        'Category',
											        'Type',
											        'Name',
											        'Value',
											        'ClinicalNote',
											        'Description'
													]
AppointmentServices.GeneralPractitionerAttributes = [
													'ID',
											        'TelehealthAppointmentID',
											        'DoctorID',
											        'HealthLink',
											        'ProviderNumber'
													]
AppointmentServices.DoctorAttributes = [
										'ID',
								        'UID',
								        'SiteID',
								        'UserAccountID',
								        'FirstName',
								        'MiddleName',
								        'LastName',
								        'DOB',
								        'Email',
								        'Phone',
								        'Enable'
									  ]
module.exports = AppointmentServices;