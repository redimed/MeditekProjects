package patient.telehealth.redimed.workinjury.redisite.patient.presenter;
import android.content.Context;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.model.EFormData;
import patient.telehealth.redimed.workinjury.model.ModelCompany;
import patient.telehealth.redimed.workinjury.model.ModelPatient;
import patient.telehealth.redimed.workinjury.model.Singleton;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.redisite.patient.view.IPatientRedisiteView;
import patient.telehealth.redimed.workinjury.utils.Key;
import patient.telehealth.redimed.workinjury.utils.Key.Site;
import patient.telehealth.redimed.workinjury.utils.Key.Staff;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by MeditekMini on 6/9/16.
 */
public class PatientRedisitePresenter implements IPatientRedisitePresenter {

    private Context context;
    private FragmentActivity activity;
    private SimpleDateFormat dateFormat;
    private ArrayList<EFormData> eFormDatas;
    private IPatientRedisiteView iPatientRedisiteView;
    private static final String TAG = "===PATIENT_RED_PRE===";
    private ModelCompany modelCompany;
    private ModelPatient[] modelPatient;
    private Gson gson;


    protected MyApplication application;

    public PatientRedisitePresenter(Context context, FragmentActivity activity, IPatientRedisiteView iPatientRedisiteView) {
        this.context = context;
        this.activity = activity;
        this.iPatientRedisiteView = iPatientRedisiteView;
        this.application = (MyApplication) context.getApplicationContext();
        gson = new Gson();

        eFormDatas = new ArrayList<>();
        application.setCurrentActivity(activity);
        dateFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.US);
    }

    @Override
    public ArrayAdapter loadSuburb() {
        return application.loadJsonData();
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null)
            application.ReplaceFragment(fragment);
    }

    @Override
    public ArrayAdapter<String> getListSalutation() {
        final Boolean[] flag = {true};
        List<String> apptType = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.salutation_arrays)));

        ArrayAdapter<String> spinnerArrayAdapter = new ArrayAdapter<String>(context, R.layout.cardview_list_item, apptType) {
            @Override
            public boolean isEnabled(int position) {
                return position != 0;
            }

            @Override
            public View getDropDownView(int position, View convertView, ViewGroup parent) {
                View view = super.getDropDownView(position, convertView, parent);
                TextView textView = (TextView) view;
                if (position == 0) {
                    textView.setTextColor(Color.GRAY);
                } else {
                    textView.setTextColor(Color.BLACK);
                }
                return view;
            }

            @Override
            public View getView(int position, View convertView, ViewGroup parent) {
                if (flag[0]) {
                    flag[0] = false;
                    View view = super.getView(position, convertView, parent);
                    ((TextView) view).setTextColor(Color.GRAY);
                    return view;
                }
                return super.getView(position, convertView, parent);
            }
        };
        spinnerArrayAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        return spinnerArrayAdapter;
    }

    @Override
    public boolean validatedAllElement(View view, String salutation) {
        boolean validated = true;
        ArrayList<View> allViewsWithinMyTopView = application.getAllChildren(view);
        for (View child : allViewsWithinMyTopView) {
            if (child instanceof EditText) {
                EditText e = (EditText) child;
                if (e.getText().length() == 0) {
                    if (e.getId() == R.id.txtFamily || e.getId() == R.id.txtGiven || e.getId() == R.id.txtDOB || e.getId() == R.id.txtOccupation ||
                            e.getId() == R.id.txtAddress || e.getId() == R.id.txtSuburb || e.getId() == R.id.txtPostCode ||
                            e.getId() == R.id.txtHome || e.getId() == R.id.txtMobile || e.getId() == R.id.txtWork) {
                        iPatientRedisiteView.onLoadErrorField(e);
                        validated = false;
                        break;
                    }
                }
                if (salutation.equalsIgnoreCase("NONE")) {
                    iPatientRedisiteView.onLoadErrorSpinner();
                    validated = false;
                    break;
                }
            }
        }
        return validated;
    }

    @Override
    public void LoadSiteData(Bundle bundle) {
        String siteUID = bundle.getString(Site.siteUid, null);
        if (siteUID != null && bundle != null){
            JsonObject objData = new JsonObject();
            objData.addProperty(Key.Company.data, application.parseToJson(new String[]{Key.Company.model, Key.Company.companySite, Key.Company.UID ,siteUID}));

            RESTClient.getTelehealthApi().getDetailSite(objData, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    modelCompany = gson.fromJson(jsonObject.get(Key.Company.data).getAsJsonObject(), ModelCompany.class);
                    iPatientRedisiteView.LoadSiteDetail(modelCompany);
                }

                @Override
                public void failure(RetrofitError error) {

                }
            });
        }
    }

    @Override
    public void LoadStaffData(Bundle bundle) {
        String staffUid = bundle.getString(Staff.staffUid, null);
        if (staffUid != null && bundle != null){
            JsonObject objData = new JsonObject();
            objData.addProperty(Key.Staff.data, application.parseToJson(new String[]{Key.Staff.UID, staffUid}));
            RESTClient.getTelehealthApi().getDetailPatient(objData, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject object, Response response) {
                    modelPatient = gson.fromJson(object.get(Key.Staff.data).getAsJsonArray(), ModelPatient[].class);
                    iPatientRedisiteView.LoadStaffDetail(modelPatient[0]);
                }

                @Override
                public void failure(RetrofitError error) {

                }
            });
        }
    }
}
