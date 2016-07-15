package patient.telehealth.redimed.workinjury.staff.presenter;

import android.content.Context;
import android.os.Bundle;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.models.ModelPatient;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.staff.view.IStaffDetailView;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by MeditekMini on 6/7/16.
 */
public class StaffDetailPresenter implements IStaffDetailPresenter {

    private String TAG = "StaffDetailPresenter";
    private Context context;
    private IStaffDetailView iStaffDetailView;
    private MyApplication application;
    private ModelPatient[] modelPatient;
    private Gson gson;


    public StaffDetailPresenter(Context context, IStaffDetailView iStaffDetailView) {
        this.context = context;
        this.iStaffDetailView = iStaffDetailView;

        application = MyApplication.getInstance();
        gson = new Gson();
    }

    @Override
    public void getDetailStaff(Bundle bundle) {
        String staffUid = bundle.getString("staffUid");
        JsonObject objData = new JsonObject();
        objData.addProperty("data", application.parseToJson(new String[]{"UID", staffUid}));
        RESTClient.getCoreApi().getDetailPatient(objData, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject object, Response response) {
                modelPatient = gson.fromJson(object.get("data").getAsJsonArray(), ModelPatient[].class);

                iStaffDetailView.StaffDetail(modelPatient[0]);
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
    }
}


