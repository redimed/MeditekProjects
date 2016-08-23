package patient.telehealth.redimed.workinjury;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.ActivityManager;
import android.app.Application;
import android.app.DatePickerDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.ArrayAdapter;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.TextView;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.jdeferred.Deferred;
import org.jdeferred.Promise;
import org.jdeferred.impl.DeferredObject;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import cn.pedant.SweetAlert.SweetAlertDialog;
import patient.telehealth.redimed.workinjury.company.detail.CompanyDetailFragment;
import patient.telehealth.redimed.workinjury.home.HomeFragment;
import patient.telehealth.redimed.workinjury.login.LoginFragment;
import patient.telehealth.redimed.workinjury.model.CustomGallery;
import patient.telehealth.redimed.workinjury.model.ModelCompany;
import patient.telehealth.redimed.workinjury.model.ModelPatient;
import patient.telehealth.redimed.workinjury.model.ModelGeneral.TempDataBean;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.setting.SettingFragment;
import patient.telehealth.redimed.workinjury.staff.list.StaffListFragment;
import patient.telehealth.redimed.workinjury.utils.Key;
import patient.telehealth.redimed.workinjury.utils.TypefaceUtil;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.mime.TypedFile;
import android.graphics.Color;

/**
 * Created by Lam on 11/6/2015.
 */
public class MyApplication extends Application {
    private static MyApplication myApplication;
    private Gson gson;
    private ModelPatient modelPatient;
    private ModelCompany modelCompany;
    private FragmentActivity currentActivity;
    private Boolean redisiteInjury;
    private List<TempDataBean> tempDataPatient, tempDataInjury, tempDataIllness,
            patientService, injuryBodyPart, injuryData, injurySymptoms, medicalHistory,
            illnessSymptoms, tempDataConsent;
    private ArrayList<CustomGallery> customGalleries;

    public static MyApplication getInstance() {
        return myApplication;
    }

    public FragmentActivity getCurrentActivity() {
        return currentActivity;
    }

    public void setCurrentActivity(FragmentActivity mCurrentActivity){
        this.currentActivity = mCurrentActivity;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        myApplication = this;
        gson = new Gson();

        RESTClient.InitRESTClient();
        TypefaceUtil.overrideFont(getApplicationContext(), "serif", "fonts/Roboto-Regular.ttf");
    }

    public boolean IsMyServiceRunning(Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
    }

    @Override
    public void onTerminate() {
        super.onTerminate();
    }

    public void replaceFragment(Fragment fragment, String fragmentName, String backStack) {
        try {
            if (fragment != null){
                FragmentManager fragmentManager = getCurrentActivity().getSupportFragmentManager();
                if (backStack != null){
                    fragmentManager.beginTransaction()
                    .replace(R.id.frame_container, fragment, fragmentName)
                    .addToBackStack(backStack)
                    .commit();
                }else {
                    fragmentManager.beginTransaction()
                    .replace(R.id.frame_container, fragment, fragmentName)
                    .commit();
                }
            }
        }catch (Exception e){
            Log.d("replaceFragment", e.getMessage());
        }
    }

    public void ReplaceFragment(Fragment fragment) {
        if (fragment != null){
            final FragmentManager fragmentManager = getCurrentActivity().getSupportFragmentManager();
            final int newBackStackLength = fragmentManager.getBackStackEntryCount() + 1;

            fragmentManager.beginTransaction()
                    .replace(R.id.frame_container, fragment)
                    .addToBackStack(null)
                    .commit();

            fragmentManager.addOnBackStackChangedListener(new FragmentManager.OnBackStackChangedListener() {
                @Override
                public void onBackStackChanged() {
                    int nowCount = fragmentManager.getBackStackEntryCount();
                    if (newBackStackLength != nowCount) {
                        fragmentManager.removeOnBackStackChangedListener(this);

                        if (newBackStackLength > nowCount) {
                            fragmentManager.popBackStackImmediate();
                        }
                    }
                }
            });
        }
    }

    public void hidenKeyboard(final View view){
        try {
            //Set up touch listener for non-text box views to hide keyboard.
            if (!(view instanceof EditText)) {
                view.setOnTouchListener(new View.OnTouchListener() {
                    public boolean onTouch(View v, MotionEvent event) {
                        InputMethodManager inputMethodManager = (InputMethodManager)getSystemService(Activity.INPUT_METHOD_SERVICE);
                        inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);
                        return false;
                    }
                });
            }

            //If a layout container, iterate over children and seed recursion.
            if (view instanceof ViewGroup) {
                for (int i = 0; i < ((ViewGroup) view).getChildCount(); i++) {
                    View innerView = ((ViewGroup) view).getChildAt(i);
                    hidenKeyboard(innerView);
                }
            }
        }catch (Exception e){
            Log.d("hidenKeyboard", e.getMessage());
        }
    }

    @SuppressLint("LongLogTag")
    public void setDataSharedPreferences(String name, Object value){
        try {
            SharedPreferences.Editor editor = getSharedPreferences("WorkInjury", Context.MODE_PRIVATE).edit();
            if( value instanceof String ) {
                editor.putString(name, (String) value);
            }else if (value instanceof Boolean){
                editor.putBoolean(name, (Boolean) value);
            }
            editor.commit();
        }catch (Exception e){
            Log.e("setDataSharedPreferences",e.getMessage());
        }

    }

    @SuppressLint("LongLogTag")
    public Object getDataSharedPreferences(String name, Object defaultValue){
        try {
            SharedPreferences workInjury = getSharedPreferences("WorkInjury", Context.MODE_PRIVATE);
            if( defaultValue instanceof String ) {
                return workInjury.getString(name, (String) defaultValue);
            }else if (defaultValue instanceof Boolean){
                return workInjury.getBoolean(name, (Boolean) defaultValue);
            }
        }catch (Exception e){
            Log.e("getDataSharedPreferences",e.getMessage());
        }
        return null;
    }

    @SuppressLint("LongLogTag")
    public void clearDataSharedPreferences(){
        try {
            SharedPreferences.Editor editor = getSharedPreferences("WorkInjury", Context.MODE_PRIVATE).edit();
            editor.clear();
            editor.commit();
        }catch (Exception e){
            Log.e("clearDataSharedPreferences",e.getMessage());
        }

    }

    public String parseToJson(String[] arr){
        Map<String, String>  map = new HashMap<>();
        for(int i=0;i<arr.length;i++) {
            map.put(arr[i], arr[i+1]);
            i = i+1;
        }
        return gson.toJson(map, Map.class);
    }

    public JsonObject createJson(String[] arr){
        JsonObject object = new JsonObject();
        for(int i=0;i<arr.length;i++) {
            object.addProperty(arr[i],arr[i+1]);
            i = i+1;
        }
        return object;
    }

    public void createTooBarTitle(View view, String title){
        try {
            //init toolbar
            AppCompatActivity appCompatActivity = (AppCompatActivity) getCurrentActivity();
            Toolbar toolbar = (Toolbar) view.findViewById(R.id.tool_bar);
            appCompatActivity.setSupportActionBar(toolbar);

            ActionBar actionBar = appCompatActivity.getSupportActionBar();
            if (actionBar != null) {
                actionBar.setHomeButtonEnabled(true);

                TextView textview = new TextView(getApplicationContext());

                ActionBar.LayoutParams layoutParams = new  ActionBar.LayoutParams(ActionBar.LayoutParams.MATCH_PARENT, ActionBar.LayoutParams.MATCH_PARENT);
                layoutParams.gravity = Gravity.CENTER_HORIZONTAL|Gravity.CENTER_HORIZONTAL;

                textview.setText(title);

                textview.setTextColor(Color.WHITE);

                textview.setGravity(Gravity.CENTER);

                textview.setTextSize(20);

                actionBar.setDisplayOptions(ActionBar.DISPLAY_SHOW_CUSTOM);

                actionBar.setCustomView(textview, layoutParams);
                actionBar.setTitle("");
                actionBar.setDisplayShowHomeEnabled(true); // show or hide the default home button
                actionBar.setDisplayHomeAsUpEnabled(true);
                actionBar.setDisplayShowCustomEnabled(true); // enable overriding the default toolbar layout
                actionBar.setDisplayShowTitleEnabled(true); // disable the default title element here (for centered title)

                // Change color image back, set a custom icon for the default home button abc_ic_clear_mtrl_alpha
                final Drawable upArrow = ContextCompat.getDrawable(getCurrentActivity(), R.drawable.abc_ic_clear_material);
                upArrow.setColorFilter(ContextCompat.getColor(getCurrentActivity(), R.color.lightFont), PorterDuff.Mode.SRC_ATOP);
                actionBar.setHomeAsUpIndicator(upArrow);
            }
        }catch (Exception e){
            Log.d("createTooBarTitle",e.getMessage());
        }
    }

    public void createTooBarLogo(View view){
        try {
            //init toolbar
            AppCompatActivity appCompatActivity = (AppCompatActivity) getCurrentActivity();
            Toolbar toolbar = (Toolbar) view.findViewById(R.id.tool_bar);
            appCompatActivity.setSupportActionBar(toolbar);

            ActionBar actionBar = appCompatActivity.getSupportActionBar();
            if (actionBar != null) {
                actionBar.setHomeButtonEnabled(true);
                actionBar.setTitle(null);
                actionBar.setDisplayShowHomeEnabled(true); // show or hide the default home button
                actionBar.setDisplayHomeAsUpEnabled(true);
                actionBar.setDisplayShowCustomEnabled(true); // enable overriding the default toolbar layout
                actionBar.setDisplayShowTitleEnabled(true); // disable the default title element here (for centered title)
                ActionBar.LayoutParams layoutParams = new  ActionBar.LayoutParams(ActionBar.LayoutParams.MATCH_PARENT, ActionBar.LayoutParams.MATCH_PARENT);
                layoutParams.gravity = Gravity.CENTER_HORIZONTAL|Gravity.CENTER_HORIZONTAL;
                LayoutInflater inflator = (LayoutInflater) this.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
                View v = inflator.inflate(R.layout.custom_toolbar_logo, null);
                actionBar.setCustomView(v, layoutParams);

                // Change color image back, set a custom icon for the default home button abc_ic_clear_mtrl_alpha
                final Drawable upArrow = ContextCompat.getDrawable(getCurrentActivity(), R.drawable.abc_ic_clear_material);
                upArrow.setColorFilter(ContextCompat.getColor(getCurrentActivity(), R.color.lightFont), PorterDuff.Mode.SRC_ATOP);
                actionBar.setHomeAsUpIndicator(upArrow);
            }
        }catch (Exception e){
            Log.d("createTooBarLogo",e.getMessage());
        }
    }

    public void createTooBarMenu(View view){
        try {
            //init toolbar
            AppCompatActivity appCompatActivity = (AppCompatActivity) getCurrentActivity();
            Toolbar toolbar = (Toolbar) view.findViewById(R.id.tool_bar);
            toolbar.setOverflowIcon(ContextCompat.getDrawable(getCurrentActivity(), R.drawable.icon_plus));
            appCompatActivity.setSupportActionBar(toolbar);

            ActionBar actionBar = appCompatActivity.getSupportActionBar();
            if (actionBar != null) {
                actionBar.setHomeButtonEnabled(true);
                actionBar.setTitle(null);
                actionBar.setDisplayShowHomeEnabled(true); // show or hide the default home button
                actionBar.setDisplayHomeAsUpEnabled(true);
                actionBar.setDisplayShowCustomEnabled(true); // enable overriding the default toolbar layout
                actionBar.setDisplayShowTitleEnabled(true); // disable the default title element here (for centered title)
                ActionBar.LayoutParams layoutParams = new  ActionBar.LayoutParams(ActionBar.LayoutParams.MATCH_PARENT, ActionBar.LayoutParams.MATCH_PARENT);
                layoutParams.gravity = Gravity.CENTER_HORIZONTAL|Gravity.CENTER_HORIZONTAL;
                LayoutInflater inflator = (LayoutInflater) this.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
                View v = inflator.inflate(R.layout.custom_toolbar_logo, null);
                actionBar.setCustomView(v, layoutParams);

                // Change color image back, set a custom icon for the default home button abc_ic_clear_mtrl_alpha
                final Drawable upArrow = ContextCompat.getDrawable(getCurrentActivity(), R.drawable.abc_ic_clear_material);
                upArrow.setColorFilter(ContextCompat.getColor(getCurrentActivity(), R.color.lightFont), PorterDuff.Mode.SRC_ATOP);
                actionBar.setHomeAsUpIndicator(upArrow);
            }
        }catch (Exception e){
            Log.d("createTooBarMenu",e.getMessage());
        }
    }

    public void BackFragment(String fragment, String backFragment){
        try {
            AppCompatActivity compatActivity = (AppCompatActivity) getCurrentActivity();

            FragmentManager fragmentManager = compatActivity.getSupportFragmentManager();
            int count = fragmentManager.getBackStackEntryCount();
            FragmentManager.BackStackEntry entry = fragmentManager.getBackStackEntryAt(count -1);

            String name = (fragment != null) ? fragment : entry.getName();
            String back = backFragment;

            Log.d("BackFragment", name);
            Log.d("BackFragment", back+"");

            Fragment fragmentCreate = null;

            if (name.equalsIgnoreCase(getString(R.string.home))){
                fragmentCreate = new HomeFragment();
                back = null;
            }else if (name.equalsIgnoreCase(getString(R.string.setting))){
                fragmentCreate = new SettingFragment();
                if(back == null)
                    back = getString(R.string.home);
            }else if (name.equalsIgnoreCase(getString(R.string.login))){
                fragmentCreate = new LoginFragment();
                if (back == null)
                    back = getString(R.string.home);
            }else if (name.equalsIgnoreCase(getString(R.string.staff_list))){
                fragmentCreate = new StaffListFragment();
                if (back ==  null)
                    back = getString(R.string.staff_list);
            }else if (name.equalsIgnoreCase(getString(R.string.company_detail))){
                fragmentCreate = new CompanyDetailFragment();
                if (back == null)
                    back = getString(R.string.setting);
            }
            Log.d("BackFragment", name);
            Log.d("BackFragment", back+"");
            Log.d("BackFragment", fragmentCreate+"");

            replaceFragment(fragmentCreate,name,back);
        }catch (Exception e){
            Log.e("BackFragment",e.getMessage());
        }
    }

    public String ConvertDate(String dataTime) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        Date myDate = null;
        String finalDate = "NONE";
        try {
            myDate = dateFormat.parse(dataTime);
            SimpleDateFormat timeFormat = new SimpleDateFormat("dd/MM/yyyy");
            timeFormat.setTimeZone(TimeZone.getDefault());
            finalDate = timeFormat.format(myDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return finalDate;
    }

    public void DisplayDatePickerDialog(final EditText editText) {
        Calendar birthdayCalendar = Calendar.getInstance();
        final SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        DatePickerDialog birthdayPickerDialog;

        birthdayPickerDialog = new DatePickerDialog(getCurrentActivity(), new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
                Calendar newCalendar = Calendar.getInstance();
                newCalendar.set(year, monthOfYear, dayOfMonth);
                editText.setText(dateFormat.format(newCalendar.getTime()));
            }
        }, birthdayCalendar.get(Calendar.YEAR), birthdayCalendar.get(Calendar.MONTH), birthdayCalendar.get(Calendar.DATE));
        birthdayPickerDialog.show();
    }

    public void setDataModelCompany(ModelCompany modelCompany){
        this.modelCompany = modelCompany;
    }

    public ModelCompany getDataModelCompany(){
        return modelCompany;
    }

    public void cleanTempDataPatient(){
        this.tempDataPatient = new ArrayList<>();
    }

    public void setTempDataPatient(TempDataBean data){
        this.tempDataPatient.add(data);
    }

    public void setTempDataPatientList(List<TempDataBean> list){
        this.tempDataPatient.addAll(list);
    }

    public void cleanTempDataIllness(){
        this.tempDataIllness = new ArrayList<>();
    }

    public void setTempDataIllness(TempDataBean data){
        this.tempDataIllness.add(data);
    }

    public void setTempDataIllnessList(List<TempDataBean> list){
        this.tempDataIllness.addAll(list);
    }

    public List<TempDataBean> getTempDataIllness() {
        return tempDataIllness;
    }

    public List<TempDataBean> getInjuryData() {
        return injuryData;
    }

    public List<TempDataBean> setInjuryData(List<TempDataBean> list) {
        return injuryData = list;
    }

    public List<TempDataBean> getPatientService() {
        return patientService;
    }

    public void setPatientService(List<TempDataBean> list){
        this.patientService = list;
    }

    public List<TempDataBean> getInjurySymptoms() {
        return injurySymptoms;
    }

    public void setInjurySymptoms(List<TempDataBean> list) {
        this.injurySymptoms = list;
    }

    public List<TempDataBean> getMedicalHistory() {
        return medicalHistory;
    }

    public void setMedicalHistory(List<TempDataBean> list) {
        this.medicalHistory = list;
    }

    public List<TempDataBean> getInjuryBodyPart() {
        return injuryBodyPart;
    }

    public void setInjuryBodyPart(TempDataBean data) {
        this.injuryBodyPart.add(data);
    }

    public List<TempDataBean> getIllnessSymptoms() {
        return illnessSymptoms;
    }

    public ArrayList<CustomGallery> getCustomGalleries() {
        return customGalleries;
    }

    public void setCustomGalleries(ArrayList<CustomGallery> customGalleries) {
        this.customGalleries = customGalleries;
    }

    public void setIllnessSymptoms(TempDataBean data) {
        this.illnessSymptoms.add(data);
    }

    public List<TempDataBean> getTempDataInjury() {
        return tempDataInjury;
    }

    public void setTempDataInjury(TempDataBean data){
        this.tempDataInjury.add(data);
    }

    public void setTempDataInjuryList(List<TempDataBean> list){
        this.tempDataInjury.addAll(list);
    }

    public void cleanTempDataInjury(){
        this.tempDataInjury = new ArrayList<>();
    }
    public List<TempDataBean> getTempDataConsent() {
        return tempDataConsent;
    }

    public void setTempDataConsent(TempDataBean data){
        this.tempDataConsent.add(data);
    }

    public void setTempDataConsentList(List<TempDataBean> list){
        this.tempDataConsent.addAll(list);
    }

    public void cleanTempDataConsent(){
        this.tempDataConsent = new ArrayList<>();
    }

    public List<TempDataBean> getTempDataPatientList() {
        return tempDataPatient;
    }

    public void setDataModelPatient(ModelPatient modelPatient){
        this.modelPatient = modelPatient;
    }

    public ModelPatient getDataModelPatient(){
        return modelPatient;
    }

    public Boolean getRedisiteInjury() {
        return redisiteInjury;
    }

    public void setRedisiteInjury(Boolean redisiteInjury) {
        this.redisiteInjury = redisiteInjury;
    }

    public boolean CheckRequiredData(EditText editText) {
        boolean isRequire = false;
        if (editText.getText().length() == 0) {
            isRequire = true;
        }
        return isRequire;
    }

    //Validate company phone
    public boolean CheckCompanyPhone(EditText editText) {
        boolean check = false;
        if (editText.getText().length() < 6) {
            check = true;
        }
        return check;
    }

    // Validate contact phone
    public String CheckContactNo(String editTextContactNo) {
        if (editTextContactNo.length() == 0) {
            return "null";
        } else {
            String expression = "^(\\+61|0061|0)?4[0-9]{8}$";
            Pattern pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(editTextContactNo);
            if (matcher.matches()) {
                String mobile = null;
                String subStringMobile = editTextContactNo.substring(0, 4);
                if (subStringMobile.equalsIgnoreCase("0061")) {
                    mobile = getResources().getString(R.string.australiaFormatPhone) +
                            editTextContactNo.substring(4, editTextContactNo.length());
                } else {
                    char subPhone = editTextContactNo.charAt(0);
                    switch (subPhone) {
                        case '0':
                            mobile = getResources().getString(R.string.australiaFormatPhone) + editTextContactNo.substring(1);
                            break;
                        case '4':
                            mobile = getResources().getString(R.string.australiaFormatPhone) + editTextContactNo;
                            break;
                    }
                }
                return mobile;
            } else {
                return "error";
            }
        }
    }

    // Validate email
    public boolean IsEmailValid(EditText editText) {
        boolean isValid = false;
        String expression = "^[\\w\\.-]+@([\\w\\-]+\\.)+[A-Z]{2,4}$";
        CharSequence inputStr = editText.getText();
        Pattern pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(inputStr);
        if (matcher.matches()) {
            isValid = true;
        }
        return isValid;
    }

    public String getCurrentDateSystem() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z", Locale.ENGLISH);
        return simpleDateFormat.format(new Date());
    }

    //Get all elements inside layout
    public ArrayList<View> getAllChildren(View v) {
        if (!(v instanceof ViewGroup)) {
            ArrayList<View> viewArrayList = new ArrayList<>();
            viewArrayList.add(v);
            return viewArrayList;
        }

        ArrayList<View> result = new ArrayList<>();
        ViewGroup vg = (ViewGroup) v;
        for (int i = 0; i < vg.getChildCount(); i++) {

            View child = vg.getChildAt(i);

            ArrayList<View> viewArrayList = new ArrayList<>();
            viewArrayList.add(v);
            viewArrayList.addAll(getAllChildren(child));

            result.addAll(viewArrayList);
        }
        return result;
    }

    public ArrayAdapter<String> loadJsonData() {
        ArrayAdapter<String> adapter = null;
        try {
            File file = new File("/data/data/" + getApplicationContext().getPackageName() + "/" + getResources().getString(R.string.fileSuburb));
            if (file.exists()) {
                FileInputStream is = new FileInputStream(file);
                int size = is.available();
                byte[] buffer = new byte[size];
                is.read(buffer);
                is.close();
                String mResponse = new String(buffer);

                JsonParser parser = new JsonParser();
                JsonObject obj = (JsonObject) parser.parse(mResponse);
                String[] suburbs = gson.fromJson(obj.get("data"), String[].class);
                adapter = new ArrayAdapter<>(MyApplication.this, R.layout.cardview_list_item, suburbs);
                adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return adapter;
    }

    public TempDataBean EformText(String name, String refRow, String value, String ref){
        TempDataBean tempDataBean = new TempDataBean();
        tempDataBean.setName(name);
        tempDataBean.setRefRow(refRow);
        tempDataBean.setValue(value);
        tempDataBean.setRef(ref);
        tempDataBean.setModuleID(0);
        tempDataBean.setChecked("");
        tempDataBean.setType("eform_input_text");
        return tempDataBean;
    }

    public TempDataBean EformDate(String name, String refRow, String value, String ref){
        TempDataBean tempDataBean = new TempDataBean();
        tempDataBean.setName(name);
        tempDataBean.setRefRow(refRow);
        tempDataBean.setValue(value);
        tempDataBean.setRef(ref);
        tempDataBean.setModuleID(0);
        tempDataBean.setChecked("");
        tempDataBean.setType("eform_input_date");
        return tempDataBean;
    }

    public TempDataBean EformRadio(String name, String refRow, String value, String checked, String ref){
        TempDataBean tempDataBean = new TempDataBean();
        tempDataBean.setName(name);
        tempDataBean.setRefRow(refRow);
        tempDataBean.setValue(value);
        tempDataBean.setRef(ref);
        tempDataBean.setChecked(checked);
        tempDataBean.setModuleID(0);
        tempDataBean.setType("eform_input_check_radio");
        return tempDataBean;
    }

    public TempDataBean EformCheckbox(String name, String refRow, String value, String checked, String ref){
        TempDataBean tempDataBean = new TempDataBean();
        tempDataBean.setName(name);
        tempDataBean.setRefRow(refRow);
        tempDataBean.setValue(value);
        tempDataBean.setRef(ref);
        tempDataBean.setChecked(checked);
        tempDataBean.setModuleID(0);
        tempDataBean.setType("eform_input_check_checkbox");
        return tempDataBean;
    }

    public Promise UploadFile(String pathImage, String fileType, String userUid){
        final Deferred deferred = new DeferredObject();
        try {

            TypedFile typedFile = new TypedFile("multipart/form-data", new File(pathImage));

            RESTClient.getCoreApi().uploadFile(userUid, fileType, typedFile, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, retrofit.client.Response response) {
                    String status = jsonObject.get("status").getAsString();
                    if (status.equalsIgnoreCase("success")) {
                        deferred.resolve(jsonObject);
                    } else{
                        deferred.reject(Key.error);
                    }
                }

                @Override
                public void failure(RetrofitError error) {
                    deferred.reject(error.getMessage());
                }
            });
        } catch (Exception e) {
            return deferred.reject(e.getMessage());
        }
        return deferred.promise();
    }

    public void FunctionError(String error){
        try {
            new SweetAlertDialog(getCurrentActivity(), SweetAlertDialog.ERROR_TYPE)
                .setTitleText("")
                .setContentText(error)
                .show();
        }catch (Exception e){
            Log.d("FunctionError",e.getLocalizedMessage());
        }

    }

    public void CreateDataPatient(){
        tempDataPatient = new ArrayList<>();
        patientService = new ArrayList<>();
    }

    public void CreateDataInjury(){
        tempDataInjury = new ArrayList<>();
        injuryBodyPart = new ArrayList<>();
        injuryData = new ArrayList<>();
        injurySymptoms = new ArrayList<>();

        medicalHistory = new ArrayList<>();
    }

    public void CreateDataIllness(){
        medicalHistory = new ArrayList<>();

        tempDataIllness = new ArrayList<>();
        illnessSymptoms = new ArrayList<>();
    }

    public void CreateDataRedisite(){
        tempDataPatient = new ArrayList<>();
        patientService = new ArrayList<>();

        tempDataInjury = new ArrayList<>();
        injuryBodyPart = new ArrayList<>();
        injuryData = new ArrayList<>();
        injurySymptoms = new ArrayList<>();

        medicalHistory = new ArrayList<>();


        tempDataIllness = new ArrayList<>();
        illnessSymptoms = new ArrayList<>();

        customGalleries = new ArrayList<>();


        tempDataConsent = new ArrayList<>();
    }
}
