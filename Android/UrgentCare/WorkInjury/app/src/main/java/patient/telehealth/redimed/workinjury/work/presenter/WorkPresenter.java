package patient.telehealth.redimed.workinjury.work.presenter;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.widget.ArrayAdapter;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import org.jdeferred.Deferred;
import org.jdeferred.Promise;
import org.jdeferred.impl.DeferredObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.model.ModelAppointmentCompany;
import patient.telehealth.redimed.workinjury.model.ModelAppointmentPatient;
import patient.telehealth.redimed.workinjury.model.ModelCompany;
import patient.telehealth.redimed.workinjury.model.ModelPatient;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.utils.Key.Site;
import patient.telehealth.redimed.workinjury.utils.Key;
import patient.telehealth.redimed.workinjury.utils.Key.Work;
import patient.telehealth.redimed.workinjury.utils.Key.Staff;
import patient.telehealth.redimed.workinjury.utils.Key.Company;
import patient.telehealth.redimed.workinjury.work.view.IWorkView;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by PhanQuocChien on 6/27/16.
 */
public class WorkPresenter implements IWorkPresenter {

    private Gson gson;
    private Activity activity;
    private IWorkView iWorkView;
    private MyApplication application;
    private boolean isAuthenticated;
    private ModelCompany modelCompany;
    private ModelPatient[] modelPatient;

    public WorkPresenter(IWorkView iWorkView, Activity activity) {
        this.iWorkView = iWorkView;
        this.activity = activity;

        gson = new Gson();
        application = MyApplication.getInstance();
    }

    @Override
    public Promise LoadJsonData() {
        final Deferred deferred = new DeferredObject();
        try {
            File f = new File(Key.locationFileSuburb + activity.getApplicationContext().getPackageName() + Key.fileSuburb);
            if (f.exists()) {
                FileInputStream is = new FileInputStream(f);
                int size = is.available();
                byte[] buffer = new byte[size];
                is.read(buffer);
                is.close();
                String mResponse = new String(buffer);

                JsonParser parser = new JsonParser();
                JsonObject obj = (JsonObject) parser.parse(mResponse);
                String [] suburb = gson.fromJson(obj.get(Work.data), String[].class);
                ArrayAdapter adapter = new ArrayAdapter(activity, android.R.layout.simple_list_item_1, suburb);
                deferred.resolve(adapter);
            }else {
                deferred.reject(Work.error);
            }
        } catch (IOException e) {
            e.printStackTrace();
            deferred.reject(Work.error);
        }
        return deferred.promise();
    }

    @Override
    public Promise MakeAppointmentCompany(ModelAppointmentCompany modelAppointmentCompany) {
        Log.d(Work.TAG, gson.toJson(modelAppointmentCompany));
        final Deferred deferred = new DeferredObject();
        String[] data = {Company.data, gson.toJson(modelAppointmentCompany)};
        RESTClient.getCoreApi().makeAppointmentCompany(application.createJson(data), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject object, Response response) {
                deferred.resolve(object);
            }

            @Override
            public void failure(RetrofitError error) {
                deferred.reject(error);
            }
        });
        return deferred.promise();
    }

    @Override
    public Promise MakeAppointmentPatient(ModelAppointmentPatient modelAppointmentPatient) {
        final Deferred deferred = new DeferredObject();

        String[] data = {Company.data, gson.toJson(modelAppointmentPatient)};
        RESTClient.getCoreApi().sendAppointmentNew(application.createJson(data), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject object, Response response) {
                deferred.resolve(object);
            }

            @Override
            public void failure(RetrofitError error) {
                deferred.reject(error);
            }
        });
        return deferred.promise();
    }

    @Override
    public void LoadSiteData(Bundle bundle) {
        String siteUID = bundle.getString(Site.siteUid, null);
        if (siteUID != null && bundle != null){
            JsonObject objData = new JsonObject();
            objData.addProperty(Company.data, application.parseToJson(new String[]{Company.model, Company.companySite, Company.UID ,siteUID}));

            RESTClient.getCoreApi().getDetailSite(objData, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    modelCompany = gson.fromJson(jsonObject.get(Company.data).getAsJsonObject(), ModelCompany.class);
                    iWorkView.LoadSiteDetail(modelCompany);
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
            objData.addProperty(Staff.data, application.parseToJson(new String[]{Staff.UID, staffUid}));
            RESTClient.getCoreApi().getDetailPatient(objData, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject object, Response response) {
                    modelPatient = gson.fromJson(object.get(Staff.data).getAsJsonArray(), ModelPatient[].class);

                    iWorkView.LoadStaffDetail(modelPatient[0]);
                }

                @Override
                public void failure(RetrofitError error) {

                }
            });
        }
    }
}
