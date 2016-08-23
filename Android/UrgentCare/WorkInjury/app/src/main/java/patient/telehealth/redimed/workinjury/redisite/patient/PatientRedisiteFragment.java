package patient.telehealth.redimed.workinjury.redisite.patient;

import android.annotation.TargetApi;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.company.site.SiteListFragment;
import patient.telehealth.redimed.workinjury.home.HomeFragment;
import patient.telehealth.redimed.workinjury.model.ModelCompany;
import patient.telehealth.redimed.workinjury.model.ModelGeneral.TempDataBean;
import patient.telehealth.redimed.workinjury.model.ModelPatient;
import patient.telehealth.redimed.workinjury.redisite.illness.GeneralFragment;
import patient.telehealth.redimed.workinjury.redisite.injury.InjuryFragment;
import patient.telehealth.redimed.workinjury.redisite.patient.adapter.ServicesAdapter;
import patient.telehealth.redimed.workinjury.redisite.patient.presenter.IPatientRedisitePresenter;
import patient.telehealth.redimed.workinjury.redisite.patient.presenter.PatientRedisitePresenter;
import patient.telehealth.redimed.workinjury.redisite.patient.view.IPatientRedisiteView;
import patient.telehealth.redimed.workinjury.staff.list.StaffListFragment;
import patient.telehealth.redimed.workinjury.utils.DeviceUtils;
import patient.telehealth.redimed.workinjury.utils.Key;
import patient.telehealth.redimed.workinjury.utils.Key.Redisite;
import patient.telehealth.redimed.workinjury.utils.PreCachingLayoutManager;

/**
 * A simple {@link Fragment} subclass.
 */
public class PatientRedisiteFragment extends Fragment implements IPatientRedisiteView, View.OnClickListener, View.OnFocusChangeListener {

    private Context context;
    private String salutation;
    private IPatientRedisitePresenter iPatientRedisitePresenter;
    protected MyApplication application;
    private List<TempDataBean> dataPatient;
    List<String> apptType;
    private ModelCompany modelCompany;
    private ModelPatient modelPatient;


    @Bind(R.id.rvServiceRedisite)
    RecyclerView rvServiceRedisite;
    @Bind(R.id.radioGroupWork)
    RadioGroup radioGroupWork;
    @Bind(R.id.layoutPatientRedisite)
    LinearLayout layoutPatientRedisite;
    /* Patient Details */
    @Bind(R.id.spinnerSalutation)
    Spinner spinnerSalutation;
    @Bind(R.id.txtClaimNo)
    EditText txtClaimNo;
    @Bind(R.id.txtFamily)
    EditText txtFamily;
    @Bind(R.id.txtGiven)
    EditText txtGiven;
    @Bind(R.id.txtDOB)
    EditText txtDOB;
    @Bind(R.id.txtOccupation)
    EditText txtOccupation;
    @Bind(R.id.txtAddress)
    EditText txtAddress;
    @Bind(R.id.txtSuburb)
    AutoCompleteTextView txtSuburb;
    @Bind(R.id.txtPostCode)
    EditText txtPostCode;
    @Bind(R.id.txtHome)
    EditText txtHome;
    @Bind(R.id.txtMobile)
    EditText txtMobile;
    @Bind(R.id.txtWork)
    EditText txtWork;
    @Bind(R.id.txtNOK)
    EditText txtNOK;
    @Bind(R.id.txtNOKPhone)
    EditText txtNOKPhone;
    @Bind(R.id.txtNOKEmail)
    EditText txtNOKEmail;
    /* Health Insurance Details */
    @Bind(R.id.txtNumber)
    EditText txtNumber;
    @Bind(R.id.txtPositionNumber)
    EditText txtPositionNumber;
    @Bind(R.id.txtExpiry)
    EditText txtExpiry;
    @Bind(R.id.txtHealthFund)
    EditText txtHealthFund;
    @Bind(R.id.txtMembership)
    EditText txtMembership;
    @Bind(R.id.txtVeteran)
    EditText txtVeteran;
    @Bind(R.id.toggleInsurance)
    RadioGroup toggleInsurance;
    @Bind(R.id.toggleHospital)
    RadioGroup toggleHospital;
    @Bind(R.id.toggleCard)
    RadioGroup toggleCard;
    @Bind(R.id.btnInjury)
    Button btnInjury;
    @Bind(R.id.btnIllness)
    Button btnIllness;
    @Bind(R.id.btnSelectStaff)
    Button btnSelectStaff;
    @Bind(R.id.btnSelectSite)
    Button btnSelectSite;

    public PatientRedisiteFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.context = getContext();
        this.application = (MyApplication) context.getApplicationContext();
        apptType = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.salutation_arrays)));
        dataPatient = application.getTempDataPatientList();
        iPatientRedisitePresenter = new PatientRedisitePresenter(context, getActivity(), this);
        if (getArguments() != null) {
            iPatientRedisitePresenter.LoadSiteData(getArguments());
            iPatientRedisitePresenter.LoadStaffData(getArguments());
        }
        modelCompany = application.getDataModelCompany();
        modelPatient = application.getDataModelPatient();
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    @Override
    public View onCreateView(LayoutInflater inflater, final ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
        getActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_VISIBLE | WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        View view = inflater.inflate(R.layout.fragment_redisite, container, false);
        setHasOptionsMenu(true);
        ButterKnife.bind(this, view);

        application.hidenKeyboard(view);
        application.createTooBarLogo(view);

        //init variable
        initSpinner();
        getListService();

        //init Suburb
        if (iPatientRedisitePresenter.loadSuburb() != null) {
            txtSuburb.setThreshold(1);
            txtSuburb.setAdapter(iPatientRedisitePresenter.loadSuburb());
        }

        if (dataPatient.size() > 0) {
            getDataPatient(dataPatient);
        }

        LoadStaffDetail(modelPatient);
        LoadSiteDetail(modelCompany);

        btnInjury.setOnClickListener(this);
        btnIllness.setOnClickListener(this);
        btnSelectSite.setOnClickListener(this);
        btnSelectStaff.setOnClickListener(this);
        txtDOB.setOnFocusChangeListener(this);

        return view;
    }

    private void getDataPatient(List<TempDataBean> list) {
        for (TempDataBean item : list) {
            switch (item.getName()) {
                case "p_firstname":
                    txtFamily.setText(item.getValue());
                    break;
                case "p_lastname":
                    txtGiven.setText(item.getValue());
                    break;
                case "p_dob":
                    txtDOB.setText(item.getValue());
                    break;
                case "p_claim":
                    txtClaimNo.setText(item.getValue());
                    break;
                case "p_address":
                    txtAddress.setText(item.getValue());
                    break;
                case "p_suburb":
                    txtSuburb.setText(item.getValue());
                    break;
                case "p_postcode":
                    txtPostCode.setText(item.getValue());
                    break;
                case "p_job":
                    txtOccupation.setText(item.getValue());
                    break;
                case "p_hm_phone":
                    txtHome.setText(item.getValue());
                    break;
                case "p_mb_phone":
                    txtMobile.setText(item.getValue());
                    break;
                case "p_wk_phone":
                    txtWork.setText(item.getValue());
                    break;
                case "kin_email":
                    txtNOKEmail.setText(item.getValue());
                    break;
                case "kin_name":
                    txtNOK.setText(item.getValue());
                    break;
                case "kin_phone":
                    txtNOKPhone.setText(item.getValue());
                    break;
                case "medicare_no":
                    txtNumber.setText(item.getValue());
                    break;
                case "pos_no":
                    txtPositionNumber.setText(item.getValue());
                    break;
                case "exp_date":
                    txtExpiry.setText(item.getValue());
                    break;
                case "private_fund":
                    txtHealthFund.setText(item.getValue());
                    break;
                case "health_fund_member":
                    txtMembership.setText(item.getValue());
                    break;
                case "veteran_no":
                    txtVeteran.setText(item.getValue());
                    break;
                case "card_holder":
                    if (item.getChecked().equalsIgnoreCase("true")) {
                        switch (item.getValue()) {
                            case "na":
                                toggleCard.check(R.id.naCard);
                                break;
                            case "gold":
                                toggleCard.check(R.id.goldCard);
                                break;
                            case "white":
                                toggleCard.check(R.id.whiteCard);
                                break;
                        }
                    }
                    break;
                case "hospital_cover":
                    if (item.getChecked().equalsIgnoreCase("true")) {
                        switch (item.getValue()) {
                            case "yes":
                                toggleHospital.check(R.id.yesHosCover);
                                break;
                            case "no":
                                toggleHospital.check(R.id.noHosCover);
                                break;
                        }
                    }
                    break;
                case "is_private_health":
                    if (item.getChecked().equalsIgnoreCase("true")) {
                        switch (item.getValue()) {
                            case "yes":
                                toggleInsurance.check(R.id.yesInsurance);
                                break;
                            case "no":
                                toggleInsurance.check(R.id.noInsurance);
                                break;
                        }
                    }
                    break;
                case "is_work_related":
                    if (item.getChecked().equalsIgnoreCase("true")) {
                        switch (item.getValue()) {
                            case "yes":
                                radioGroupWork.check(R.id.radioWork);
                                break;
                            case "no":
                                radioGroupWork.check(R.id.radioNonWork);
                                break;
                        }
                    }
                    break;
                case "p_title":
                    if (item.getChecked().equalsIgnoreCase("true")) {
                        spinnerSalutation.setSelection(apptType.indexOf(item.getValue()));
                    }
                    break;
                default:
                    break;
            }
        }
    }

    public void getListService() {
        ServicesAdapter servicesAdapter = new ServicesAdapter(context);

        PreCachingLayoutManager layoutManagerCategories = new PreCachingLayoutManager(context);
        layoutManagerCategories.setOrientation(LinearLayoutManager.VERTICAL);
        layoutManagerCategories.setExtraLayoutSpace(DeviceUtils.getScreenWidth(context));

        rvServiceRedisite.setLayoutManager(layoutManagerCategories);
        rvServiceRedisite.setAdapter(servicesAdapter);
    }

    private void initSpinner() {
        spinnerSalutation.setAdapter(iPatientRedisitePresenter.getListSalutation());
        spinnerSalutation.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String selectedItemText = (String) parent.getItemAtPosition(position);
                // If user change the default selection
                // First item is disable and it is used for hint
                if (position == 0) {
                    salutation = "NONE";
                } else {
                    // Notify the selected item text
                    salutation = selectedItemText;
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
    }

    @Override
    public void onLoadErrorSpinner() {
        ((TextView) spinnerSalutation.getSelectedView()).setError("Please input information");
    }

    @Override
    public void onLoadErrorField(EditText editText) {
        if (editText != null) {
            editText.requestFocus();
            editText.setError("Please input information");
        }
    }

    @Override
    public void LoadSiteDetail(ModelCompany modelCompany) {
        if (modelCompany != null) {
            try {
                btnSelectSite.setText((CharSequence) modelCompany.getSiteName());
                application.setDataModelCompany(modelCompany);
            } catch (Exception e) {
                Log.d("LoadSiteDetail", e.getMessage());
            }
        }
    }

    @Override
    public void LoadStaffDetail(ModelPatient modelPatient) {
        if (modelPatient != null) {
            try {
                txtFamily.setText(modelPatient.getFirstName());
                txtGiven.setText(modelPatient.getLastName());
                txtDOB.setText(modelPatient.getDOB());
                txtAddress.setText(modelPatient.getAddress1());
                txtSuburb.setText(modelPatient.getSuburb());
                txtPostCode.setText(modelPatient.getPostcode());
                txtHome.setText(modelPatient.getHomePhoneNumber());
                txtNOKEmail.setText(modelPatient.getEmail1());

                application.setDataModelPatient(modelPatient);
            } catch (Exception e) {
                Log.d("LoadStaffDetail", e.getMessage());
            }
        }
    }

    public void SaveDataPatient() {

        if (modelPatient == null) {
            modelPatient = new ModelPatient();
        }

        modelPatient.setFirstName(String.valueOf(txtFamily.getText()));
        modelPatient.setLastName(String.valueOf(txtGiven.getText()));
        modelPatient.setHomePhoneNumber(String.valueOf(txtHome.getText()));
        modelPatient.setDOB(String.valueOf(txtDOB.getText()));
        modelPatient.setEmail1(String.valueOf(txtNOKEmail.getText()));


        application.setDataModelPatient(modelPatient);

        //set data in eform
        application.cleanTempDataPatient();

        application.setTempDataPatient(application.EformText("p_firstname", "row_0_7", String.valueOf(txtFamily.getText()), "field_0_7_1"));
        application.setTempDataPatient(application.EformText("p_lastname", "row_0_7", String.valueOf(txtGiven.getText()), "field_0_7_3"));
        application.setTempDataPatient(application.EformText("p_dob", "row_0_8", String.valueOf(txtDOB.getText()), "field_0_8_4"));
        application.setTempDataPatient(application.EformDate("p_claim", "row_0_8", String.valueOf(txtClaimNo.getText()), "field_0_8_3"));
        application.setTempDataPatient(application.EformText("p_address", "row_0_9", String.valueOf(txtAddress.getText()), "field_0_9_1"));
        application.setTempDataPatient(application.EformText("p_suburb", "row_0_10", String.valueOf(txtSuburb.getText()), "field_0_10_1"));
        application.setTempDataPatient(application.EformText("p_job", "row_0_10", String.valueOf(txtOccupation.getText()), "field_0_10_3"));
        application.setTempDataPatient(application.EformText("p_postcode", "row_0_10", String.valueOf(txtPostCode.getText()), "field_0_10_2"));
        application.setTempDataPatient(application.EformText("p_hm_phone", "row_0_11", String.valueOf(txtHome.getText()), "field_0_11_1"));
        application.setTempDataPatient(application.EformText("p_mb_phone", "row_0_11", String.valueOf(txtMobile.getText()), "field_0_11_2"));
        application.setTempDataPatient(application.EformText("p_wk_phone", "row_0_12", String.valueOf(txtWork.getText()), "field_0_12_1"));
        application.setTempDataPatient(application.EformText("kin_email", "row_0_12", String.valueOf(txtNOKEmail.getText()), "field_0_12_3"));
        application.setTempDataPatient(application.EformText("kin_name", "row_0_13", String.valueOf(txtNOK.getText()), "field_0_13_1"));
        application.setTempDataPatient(application.EformText("kin_phone", "row_0_13", String.valueOf(txtNOKPhone.getText()), "field_0_13_3"));
        application.setTempDataPatient(application.EformText("medicare_no", "row_1_0", String.valueOf(txtNumber.getText()), "field_1_0_1"));
        application.setTempDataPatient(application.EformText("pos_no", "row_1_0", String.valueOf(txtPositionNumber.getText()), "field_1_0_2"));
        application.setTempDataPatient(application.EformText("exp_date", "row_1_0", String.valueOf(txtExpiry.getText()), "field_1_0_5"));
        application.setTempDataPatient(application.EformText("private_fund", "row_1_2", String.valueOf(txtHealthFund.getText()), "field_1_2_1"));
        application.setTempDataPatient(application.EformText("health_fund_member", "row_1_2", String.valueOf(txtMembership.getText()), "field_1_2_2"));
        application.setTempDataPatient(application.EformText("veteran_no", "row_1_4", String.valueOf(txtVeteran.getText()), "field_1_4_1"));

        application.setTempDataPatient(application.EformRadio("is_work_related", "row_0_0", "yes", (radioGroupWork.getCheckedRadioButtonId() == R.id.radioWork) ? "true" : "false", "field_0_0_0"));
        application.setTempDataPatient(application.EformRadio("is_work_related", "row_0_0", "no", (radioGroupWork.getCheckedRadioButtonId() == R.id.radioNonWork) ? "true" : "false", "field_0_0_1"));

        application.setTempDataPatient(application.EformRadio("hospital_cover", "row_1_3", "yes", (toggleHospital.getCheckedRadioButtonId() == R.id.yesHosCover) ? "true" : "false", "field_1_3_1"));
        application.setTempDataPatient(application.EformRadio("hospital_cover", "row_1_3", "no", (toggleHospital.getCheckedRadioButtonId() == R.id.noHosCover) ? "true" : "false", "field_1_3_2"));

        application.setTempDataPatient(application.EformRadio("card_holder", "row_1_5", "na", (toggleCard.getCheckedRadioButtonId() == R.id.naCard) ? "true" : "false", "field_1_5_1"));
        application.setTempDataPatient(application.EformRadio("card_holder", "row_1_5", "gold", (toggleCard.getCheckedRadioButtonId() == R.id.goldCard) ? "true" : "false", "field_1_5_2"));
        application.setTempDataPatient(application.EformRadio("card_holder", "row_1_5", "white", (toggleCard.getCheckedRadioButtonId() == R.id.whiteCard) ? "true" : "false", "field_1_5_3"));

        application.setTempDataPatient(application.EformRadio("is_private_health", "row_1_1", "yes", (toggleInsurance.getCheckedRadioButtonId() == R.id.yesInsurance) ? "true" : "false", "field_1_1_1"));
        application.setTempDataPatient(application.EformRadio("is_private_health", "row_1_1", "no", (toggleInsurance.getCheckedRadioButtonId() == R.id.noInsurance) ? "true" : "false", "field_1_1_2"));

        application.setTempDataPatient(application.EformRadio("p_title", "row_0_5", "Mr", (salutation.equalsIgnoreCase("Mr")) ? "true" : "false", "field_0_5_1"));
        application.setTempDataPatient(application.EformRadio("p_title", "row_0_5", "Mrs", (salutation.equalsIgnoreCase("Mrs")) ? "true" : "false", "field_0_5_2"));
        application.setTempDataPatient(application.EformRadio("p_title", "row_0_5", "Ms", (salutation.equalsIgnoreCase("Ms")) ? "true" : "false", "field_0_5_3"));
        application.setTempDataPatient(application.EformRadio("p_title", "row_0_6", "Miss", (salutation.equalsIgnoreCase("Miss")) ? "true" : "false", "field_0_6_1"));
        application.setTempDataPatient(application.EformRadio("p_title", "row_0_6", "Master", (salutation.equalsIgnoreCase("Master")) ? "true" : "false", "field_0_6_2"));
        application.setTempDataPatient(application.EformRadio("p_title", "row_0_6", "Dr", (salutation.equalsIgnoreCase("Dr")) ? "true" : "false", "field_0_6_3"));

        application.setTempDataPatientList(application.getPatientService());
    }

    @Override
    public void onClick(View v) {
        Bundle bundle = new Bundle();
        bundle.putBoolean(Redisite.name, true);
        switch (v.getId()) {
            case R.id.btnInjury:
                if (iPatientRedisitePresenter.validatedAllElement(layoutPatientRedisite, salutation)) {
                    SaveDataPatient();
                    application.replaceFragment(new InjuryFragment(), Key.fmRedisiteInjury, Key.fmRedisitePatient);
                }
                break;
            case R.id.btnIllness:
                if (iPatientRedisitePresenter.validatedAllElement(layoutPatientRedisite, salutation)) {
                    SaveDataPatient();
                    application.replaceFragment(new GeneralFragment(), Key.fmRedisiteIllness, Key.fmRedisitePatient);
                }
                break;
            case R.id.btnSelectStaff:
                StaffListFragment fragmentSite = new StaffListFragment();
                fragmentSite.setArguments(bundle);
                application.replaceFragment(fragmentSite, Key.fmStaffList, Key.fmRedisitePatient);
                break;
            case R.id.btnSelectSite:
                SiteListFragment fragmentStaff = new SiteListFragment();
                fragmentStaff.setArguments(bundle);
                application.replaceFragment(fragmentStaff, Key.fmSiteList, Key.fmRedisitePatient);
                break;
        }
    }

    @Override
    public void onFocusChange(View view, boolean b) {
        if (b) {
            application.DisplayDatePickerDialog(txtDOB);
        } else {
            application.hidenKeyboard(view);
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                application.replaceFragment(new HomeFragment(), Key.fmHome, null);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }
}
