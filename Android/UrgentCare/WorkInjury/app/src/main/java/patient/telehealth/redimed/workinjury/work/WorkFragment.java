package patient.telehealth.redimed.workinjury.work;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TextView;
import com.google.gson.JsonObject;
import org.jdeferred.DoneCallback;
import org.jdeferred.FailCallback;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.home.HomeFragment;
import patient.telehealth.redimed.workinjury.model.ModelAppointmentCompany;
import patient.telehealth.redimed.workinjury.model.ModelAppointmentPatient;
import patient.telehealth.redimed.workinjury.model.ModelCompany;
import patient.telehealth.redimed.workinjury.model.ModelPatient;
import patient.telehealth.redimed.workinjury.company.site.SiteListFragment;
import patient.telehealth.redimed.workinjury.staff.list.StaffListFragment;
import patient.telehealth.redimed.workinjury.utils.Key;
import patient.telehealth.redimed.workinjury.utils.Key.Work;
import patient.telehealth.redimed.workinjury.work.presenter.IWorkPresenter;
import patient.telehealth.redimed.workinjury.work.presenter.WorkPresenter;
import patient.telehealth.redimed.workinjury.work.view.IWorkView;
import patient.telehealth.redimed.workinjury.model.ModelAppointmentCompany.AppointmentsBean.AppointmentDataBean;
import patient.telehealth.redimed.workinjury.model.ModelAppointmentCompany.AppointmentsBean;
import patient.telehealth.redimed.workinjury.model.ModelAppointmentCompany.AppointmentsBean.PatientsBean;
import patient.telehealth.redimed.workinjury.model.ModelAppointmentCompany.AppointmentsBean.PatientAppointmentBean;
import retrofit.RetrofitError;

public class WorkFragment extends Fragment implements IWorkView, View.OnClickListener, AdapterView.OnItemSelectedListener, View.OnFocusChangeListener {

    private String TAG = Key.Work.TAG;
    private MyApplication application;
    private IWorkPresenter iWorkPresenter;
    private boolean isAuthenticated;
    private boolean isTypeCompany;
    private String apptType;
    private String title;
    private ModelAppointmentCompany modelAppointmentCompany;
    private ModelAppointmentPatient modelAppointmentPatient;
    private Bundle bundle;
    private ModelCompany modelCompany;
    private ModelPatient modelPatient;
    private String uidPatientCompany;
    private List<TextView> arrTextView;
    private List<EditText> arrEditText;
    private SweetAlertDialog dialog;


    @Bind(R.id.txtFirstName) EditText txtFirstName;
    @Bind(R.id.txtLastName) EditText txtLastName;
    @Bind(R.id.txtContactPhone) EditText txtContactPhone;
    @Bind(R.id.txtDOB) EditText txtDOB;
    @Bind(R.id.txtEmail) EditText txtEmail;
    @Bind(R.id.txtDescription) EditText txtDescription;
    @Bind(R.id.autoCompleteSuburb) AutoCompleteTextView autoCompleteSuburb;
    @Bind(R.id.btnWorkInjury) Button btnWorkInjury;
    @Bind(R.id.btnSelectStaff) Button btnSelectStaff;
    @Bind(R.id.btnSelectSite) Button btnSelectSite;
    @Bind(R.id.lblFNRequire) TextView lblFNRequire;
    @Bind(R.id.lblLNRequire) TextView lblLNRequire;
    @Bind(R.id.lblPhoneRequire) TextView lblPhoneRequire;
    @Bind(R.id.lblCTRequire) TextView lblCTRequire;
    @Bind(R.id.lblCNRequire) TextView lblCNRequire;
    @Bind(R.id.txtCompanyName) EditText txtCompanyName;
    @Bind(R.id.txtContactPerson) EditText txtContactPerson;
    @Bind(R.id.txtCompanyPhone) EditText txtCompanyPhone;
    @Bind(R.id.radioGroupGPReferral) RadioGroup radioGroupGPReferral;
    @Bind(R.id.radioY) RadioButton radioY;
    @Bind(R.id.radioGroupTypeTreatment) RadioGroup radioGroupTypeTreatment;
    @Bind(R.id.spinnerAppointmentType) Spinner spinnerAppointmentType;
    @Bind(R.id.relativeLayoutGPReferral) RelativeLayout relativeLayoutGPReferral;
    @Bind(R.id.relativeLayoutTreatment) RelativeLayout relativeLayoutTreatment;


    public WorkFragment() {

    }


    @Override
    public void onCreate (Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        application = MyApplication.getInstance();
        iWorkPresenter = new WorkPresenter(this, getActivity());
        iWorkPresenter.LoadSiteData(getArguments());
        iWorkPresenter.LoadStaffData(getArguments());
        isAuthenticated = (boolean) application.getDataSharedPreferences(Key.isAuthenticated, false);
        isTypeCompany = (boolean) application.getDataSharedPreferences(Key.isTypeCompany, false);
        title = getArguments().getString(Key.Work.workType, Key.defalt);
        modelAppointmentCompany = new ModelAppointmentCompany();
        modelAppointmentPatient = new ModelAppointmentPatient();
        modelCompany = application.getDataModelCompany();
        modelPatient = application.getDataModelPatient();
        bundle = new Bundle();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        getActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_VISIBLE | WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        View view = inflater.inflate(R.layout.fragment_work, container, false);
        //TypefaceUtil.applyFont(getActivity(), view.findViewById(R.id.workActivity), Key.fontRoboto);
        setHasOptionsMenu(true);
        ButterKnife.bind(this, view);
        application.createTooBar(view, getActivity(), title);
        application.hidenKeyboard(view);

        if (isTypeCompany){
            txtCompanyName.setText((CharSequence) application.getDataSharedPreferences(Key.companyName, Key.defalt));
            btnSelectStaff.setVisibility(View.VISIBLE);
            btnSelectSite.setVisibility(View.VISIBLE);
        }

        if (title.equalsIgnoreCase(Work.rehab)){
            relativeLayoutTreatment.setVisibility(View.VISIBLE);
            relativeLayoutGPReferral.setVisibility(View.VISIBLE);
        }

        if (title.equalsIgnoreCase(Work.generalClinic)){

        }

        if (title.equalsIgnoreCase(Work.specialistClinic)){
            relativeLayoutGPReferral.setVisibility(View.VISIBLE);
        }

        radioY.setChecked(true);
        btnWorkInjury.setOnClickListener(this);
        btnSelectStaff.setOnClickListener(this);
        btnSelectSite.setOnClickListener(this);
        spinnerAppointmentType.setOnItemSelectedListener(this);
        txtDOB.setOnFocusChangeListener(this);

        txtFirstName.setText((CharSequence) application.getDataSharedPreferences(Work.firstName, Key.defalt));
        txtLastName.setText((CharSequence) application.getDataSharedPreferences(Work.lastName, Key.defalt));
        txtContactPhone.setText((CharSequence) application.getDataSharedPreferences(Work.contactPhone, Key.defalt));
        autoCompleteSuburb.setText((CharSequence) application.getDataSharedPreferences(Work.suburb, Key.defalt));
        txtDOB.setText((CharSequence) application.getDataSharedPreferences(Work.dob, Key.defalt));
        txtEmail.setText((CharSequence) application.getDataSharedPreferences(Work.email, Key.defalt));

        iWorkPresenter.LoadJsonData().done(new DoneCallback() {
            @Override
            public void onDone(Object result) {
                autoCompleteSuburb.setThreshold(1);
                autoCompleteSuburb.setAdapter((ArrayAdapter) result);
            }
        });

        if (modelPatient != null){
            LoadStaffDetail(modelPatient);
        }

        if (modelCompany != null){
            LoadSiteDetail(modelCompany);
        }

        return view;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                application.replaceFragment(getActivity(), new HomeFragment(), Key.fmHome, null);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
    }

    private AppointmentDataBean setData(String name, String value) {
        AppointmentDataBean data  = new AppointmentDataBean();
        data.setName(name);
        data.setType(Work.requestPatient);
        data.setCategory(Work.appointment);
        data.setSection(Work.telehealth);
        data.setValue(value);
        return data;
    }

    private PatientsBean setPatient(String UID){
        PatientsBean patient = new PatientsBean();
        patient.setUID(UID);
        return patient;
    }

    private void MakeAppointment(List<EditText> arr){
        if (!CheckValidateFrom(arr)) {
            dialog = new SweetAlertDialog(getActivity(), SweetAlertDialog.ERROR_TYPE);
            dialog.setTitleText(getResources().getString(R.string.dialogError));
            dialog.setContentText(getResources().getString(R.string.contentDialogErrorFrom));
            dialog.setCancelable(false);
            dialog.show();
            return;
        }


        PatientAppointmentBean patient = new PatientAppointmentBean();
        patient.setFirstName(String.valueOf(txtFirstName.getText()));
        patient.setLastName(String.valueOf(txtLastName.getText()));
        patient.setPhoneNumber(String.valueOf(txtContactPhone.getText()));
        patient.setDOB(String.valueOf(txtDOB.getText()));
        patient.setEmail1(String.valueOf(txtEmail.getText()));
        patient.setSuburb(String.valueOf(autoCompleteSuburb.getText()));

        List<AppointmentDataBean> listData = new ArrayList<>();
        listData.add(setData(Work.companyName, txtCompanyName.getText().toString()));
        listData.add(setData(Work.companyPhoneNumber, txtCompanyPhone.getText().toString()));
        listData.add(setData(Work.contactPerson, txtContactPerson.getText().toString()));

        if (title.equalsIgnoreCase(Work.rehab)){
            listData.add(setData(Work.reh, Work.y));
            listData.add(setData(Work.specialist, Work.n));
            listData.add(setData(Work.gp, Work.n));
            listData.add(setData(Work.gpReferral,(radioGroupGPReferral.getCheckedRadioButtonId() == -1) ? null : ((RadioButton) getView().findViewById(radioGroupGPReferral.getCheckedRadioButtonId())).getHint().toString()));
            String typeTreatment = (radioGroupTypeTreatment.getCheckedRadioButtonId() == -1) ? null : ((RadioButton) getView().findViewById(radioGroupTypeTreatment.getCheckedRadioButtonId())).getHint().toString();
            if (typeTreatment != null) {
                switch (typeTreatment) {
                    case Work.phy:
                        listData.add(setData(Work.physiotherapy, Work.y));
                        listData.add(setData(Work.exerciseRehab, Work.n));
                        listData.add(setData(Work.handTherapy, Work.n));
                        break;
                    case Work.exer:
                        listData.add(setData(Work.physiotherapy, Work.n));
                        listData.add(setData(Work.exerciseRehab, Work.y));
                        listData.add(setData(Work.handTherapy, Work.n));
                        break;
                    case Work.hand:
                        listData.add(setData(Work.physiotherapy, Work.n));
                        listData.add(setData(Work.exerciseRehab, Work.n));
                        listData.add(setData(Work.handTherapy, Work.y));
                        break;
                }
            }
        }

        if (title.equalsIgnoreCase(Work.generalClinic)){
            listData.add(setData(Work.reh, Work.n));
            listData.add(setData(Work.specialist, Work.n));
            listData.add(setData(Work.gp, Work.y));
        }

        if (title.equalsIgnoreCase(Work.specialistClinic)){
            listData.add(setData(Work.reh, Work.n));
            listData.add(setData(Work.specialist, Work.y));
            listData.add(setData(Work.gp, Work.n));
            listData.add(setData(Work.gpReferral ,(radioGroupGPReferral.getCheckedRadioButtonId() == -1) ? null : ((RadioButton) getView().findViewById(radioGroupGPReferral.getCheckedRadioButtonId())).getHint().toString()));
        }

        List<PatientsBean> listPatientUID = new ArrayList<>();

        //send patient
        if (isAuthenticated && !isTypeCompany){
            listPatientUID.add(setPatient(String.valueOf(application.getDataSharedPreferences(Key.patientUid, Key.defalt))));
        }

        //send company
        if (isAuthenticated && isTypeCompany) {
            listPatientUID.add(setPatient(uidPatientCompany));
        }

        dialog = new SweetAlertDialog(getActivity(), SweetAlertDialog.PROGRESS_TYPE);
        dialog.getProgressHelper().setBarColor(Color.parseColor(Work.A5DC86));
        dialog.setTitleText(getResources().getString(R.string.progressMakeAppointmentContent));
        dialog.setCancelable(false);
        dialog.show();

        if (isAuthenticated){
            AppointmentsBean appointment = new AppointmentsBean();
            appointment.setType(apptType);
            appointment.setRequestDate(new SimpleDateFormat(Key.dateFormat).format(new Date()));
            appointment.setDescription(String.valueOf(txtDescription.getText()));
            appointment.setPatientAppointment(patient);
            appointment.setAppointmentData(listData);
            appointment.setPatients(listPatientUID);
            List<AppointmentsBean> listAppt = new ArrayList<>();
            listAppt.add(appointment);
            modelAppointmentCompany.setAppointments(listAppt);

            //send login
            iWorkPresenter.MakeAppointmentCompany(modelAppointmentCompany).then(new DoneCallback() {
                @Override
                public void onDone(Object result) {
                    dialog.dismissWithAnimation();
                    sendAppointmentSuccess(result);
                }
            }, new FailCallback() {
                @Override
                public void onFail(Object result) {
                    dialog.dismissWithAnimation();
                    sendAppointmentError(result);
                }
            });
        }else {
            modelAppointmentPatient.setAppointmentData(listData);
            modelAppointmentPatient.setType(apptType);
            modelAppointmentPatient.setDescription(String.valueOf(txtDescription.getText()));
            modelAppointmentPatient.setRequestDate(new SimpleDateFormat(Key.dateFormat).format(new Date()));
            modelAppointmentPatient.setPatientAppointment(patient);

            //send not login
            iWorkPresenter.MakeAppointmentPatient(modelAppointmentPatient).then(new DoneCallback() {
                @Override
                public void onDone(Object result) {
                    dialog.dismissWithAnimation();
                    sendAppointmentSuccess(result);
                }
            }, new FailCallback() {
                @Override
                public void onFail(Object result) {
                    dialog.dismissWithAnimation();

                    sendAppointmentError(result);
                }
            });
        }
    }

    private void sendAppointmentError(Object object){
        RetrofitError error = (RetrofitError) object;

        dialog = new SweetAlertDialog(getActivity(), SweetAlertDialog.ERROR_TYPE);
        dialog.setTitleText(getResources().getString(R.string.dialogError));
        dialog.setContentText(error.getLocalizedMessage());
        dialog.setConfirmClickListener(new SweetAlertDialog.OnSweetClickListener() {
            @Override
            public void onClick(SweetAlertDialog sDialog) {
                dialog.dismissWithAnimation();
            }
        });
        dialog.show();
    }

    private void sendAppointmentSuccess(Object result){
        JsonObject object = (JsonObject) result;

        String data = object.get(Work.status).getAsString();
        if (data.equalsIgnoreCase(Work.success)) {
            dialog = new SweetAlertDialog(getActivity(), SweetAlertDialog.SUCCESS_TYPE);
            dialog.setTitleText(getResources().getString(R.string.dialogSuccess));
            dialog.setContentText(getResources().getString(R.string.contentDialogSuccessAppointment));
            dialog.setConfirmClickListener(new SweetAlertDialog.OnSweetClickListener() {
                @Override
                public void onClick(SweetAlertDialog sDialog) {
                    dialog.dismissWithAnimation();
                    application.replaceFragment(getActivity(),new HomeFragment(), Key.fmHome, null);
                }
            });
            dialog.setCancelClickListener(new SweetAlertDialog.OnSweetClickListener() {
                @Override
                public void onClick(SweetAlertDialog sweetAlertDialog) {
                    dialog.dismissWithAnimation();
                    application.replaceFragment(getActivity(),new HomeFragment(), Key.fmHome, null);
                }
            });
            CheckExistsInformation(dialog);
            dialog.show();
        }
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.btnWorkInjury:
                arrEditText = new ArrayList<>();
                arrEditText.add(txtFirstName);
                arrEditText.add(txtLastName);
                arrEditText.add(txtContactPhone);
                arrEditText.add(txtCompanyName);
                arrEditText.add(txtContactPerson);

                MakeAppointment(arrEditText);
                break;
            case  R.id.btnSelectStaff:
                StaffListFragment staffFragment = new StaffListFragment();
                bundle.putBoolean(Work.name, true);
                staffFragment.setArguments(bundle);
                application.replaceFragment(getActivity(), staffFragment, Key.fmStaffList, Key.fmWork);
                break;
            case R.id.btnSelectSite:
                SiteListFragment siteFragment = new SiteListFragment();
                bundle.putBoolean(Work.name, true);
                siteFragment.setArguments(bundle);
                application.replaceFragment(getActivity(), siteFragment, Key.fmSiteList, Key.fmWork);
                break;
        }
    }

    @Override
    public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
        apptType = String.valueOf(adapterView.getItemAtPosition(i));
    }

    @Override
    public void onNothingSelected(AdapterView<?> adapterView) {

    }

    @Override
    public void onFocusChange(View view, boolean b) {
        if (b) {
            application.DisplayDatePickerDialog(txtDOB, getActivity());
        }else {
            application.hidenKeyboard(view);
        }
    }

    @Override
    public void LoadSiteDetail(ModelCompany modelCompany) {
        if (modelCompany != null){
            txtContactPerson.setText((CharSequence) modelCompany.getContactName());
            txtCompanyPhone.setText((CharSequence) modelCompany.getHomePhoneNumber());

            application.setDataModelCompany(modelCompany);
        }
    }

    @Override
    public void LoadStaffDetail(ModelPatient modelPatient) {
        if (modelPatient != null){
            uidPatientCompany = modelPatient.getUID();
            txtFirstName.setText(modelPatient.getFirstName());
            txtLastName.setText(modelPatient.getLastName());
            txtContactPhone.setText(modelPatient.getHomePhoneNumber());
            autoCompleteSuburb.setText(modelPatient.getSuburb());
            txtDOB.setText(modelPatient.getDOB());
            txtEmail.setText(modelPatient.getEmail1());

            application.setDataModelPatient(modelPatient);
        }
    }



    private void InformationUrgent(final SweetAlertDialog dialog) {
        dialog.setContentText(getResources().getString(R.string.confirmSaveInfo));
        dialog.setCancelText(Work.cancel);
        dialog.setCancelClickListener(new SweetAlertDialog.OnSweetClickListener() {
            @Override
            public void onClick(SweetAlertDialog sweetAlertDialog) {
                application.replaceFragment(getActivity(),new HomeFragment(), Key.fmHome, null);
            }
        });
        dialog.setConfirmText(Work.save);
        dialog.setConfirmClickListener(new SweetAlertDialog.OnSweetClickListener() {
            @Override
            public void onClick(SweetAlertDialog sweetAlertDialog) {
                application.setDataSharedPreferences(Work.firstName, String.valueOf(txtFirstName.getText()));
                application.setDataSharedPreferences(Work.lastName, String.valueOf(txtLastName.getText()));
                application.setDataSharedPreferences(Work.contactPhone, String.valueOf(txtContactPhone.getText()));
                application.setDataSharedPreferences(Work.suburb, String.valueOf(autoCompleteSuburb.getText()));
                application.setDataSharedPreferences(Work.dob, String.valueOf(txtDOB.getText()));
                application.setDataSharedPreferences(Work.email, String.valueOf(txtEmail.getText()));
                dialog.dismissWithAnimation();
                application.replaceFragment(getActivity(),new HomeFragment(), Key.fmHome, null);
            }
        });
        dialog.show();
    }

    public void CheckExistsInformation(final SweetAlertDialog dialog) {
        if (!txtFirstName.getText().toString().trim().equalsIgnoreCase(String.valueOf(application.getDataSharedPreferences(Work.firstName, Key.defalt)).trim())
                || !txtLastName.getText().toString().trim().equalsIgnoreCase(String.valueOf(application.getDataSharedPreferences(Work.lastName, Key.defalt)).trim())
                || !txtContactPhone.getText().toString().trim().equalsIgnoreCase(String.valueOf(application.getDataSharedPreferences(Work.contactPhone, Key.defalt)).trim())
                || !autoCompleteSuburb.getText().toString().trim().equalsIgnoreCase(String.valueOf(application.getDataSharedPreferences(Work.suburb, Key.defalt)).trim())
                || !txtDOB.getText().toString().trim().equalsIgnoreCase(String.valueOf(application.getDataSharedPreferences(Work.dob, Key.defalt)).trim())
                || !txtEmail.getText().toString().trim().equalsIgnoreCase(String.valueOf(application.getDataSharedPreferences(Work.email, Key.defalt)).trim()))
        {
            InformationUrgent(dialog);
        }
    }

    private boolean CheckValidateFrom(List<EditText> arr) {
        arrTextView = new ArrayList<>();
        arrTextView.add(lblFNRequire);
        arrTextView.add(lblLNRequire);
        arrTextView.add(lblPhoneRequire);
        arrTextView.add(lblCNRequire);
        arrTextView.add(lblCTRequire);

        // Initialize buttons
        final Drawable customErrorDrawable = getResources().getDrawable(R.drawable.error_edit_text_icon);
        customErrorDrawable.setBounds(0, 0, customErrorDrawable.getIntrinsicWidth(), customErrorDrawable.getIntrinsicHeight());
        boolean validate = true;

        // Validation Edit Text
        for (int i = 0; i < arr.size(); i++) {
            if (application.CheckRequiredData(arr.get(i))) {
                arr.get(i).setError(getResources().getString(R.string.isRequired), customErrorDrawable);
                arrTextView.get(i).setVisibility(View.GONE);
                validate = false;
            } else {
                arr.get(i).setError(null);
            }
        }

        // Validate phone number australian phone number: 10digits (0X YYYY YYYY)
        if (application.CheckContactNo(txtContactPhone.getText().toString()) == Work.valueNull) {
            txtContactPhone.setError(getResources().getString(R.string.contactPhoneRequired), customErrorDrawable);
            lblPhoneRequire.setVisibility(View.GONE);
            validate = false;
        } else if (application.CheckContactNo(txtContactPhone.getText().toString()) == Work.error) {
            txtContactPhone.setError(getResources().getString(R.string.contactPhoneFormat), customErrorDrawable);
            lblPhoneRequire.setVisibility(View.GONE);
            validate = false;
        } else {
            txtContactPhone.setError(null);
            lblPhoneRequire.setVisibility(View.VISIBLE);
        }

        // Validate email format
        if (!application.IsEmailValid(txtEmail) && txtEmail.getText().length() > 0) {
            txtEmail.setError(getResources().getString(R.string.emailValid), customErrorDrawable);
            validate = false;
        } else {
            txtEmail.setError(null);
        }

        if (application.CheckCompanyPhone(txtCompanyPhone) && txtCompanyPhone.getText().length() > 0) {
            txtCompanyPhone.setError(getResources().getString(R.string.companyPhoneFormat), customErrorDrawable);
            validate = false;
        } else {
            txtCompanyPhone.setError(null);
        }
        return validate;
    }

    @Override
    public void onResume() {
        super.onResume();
    }

    @Override
    public void onDetach() {
        super.onDetach();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
    }


}
