package patient.telehealth.redimed.workinjury.staff.detail.presenter;

import android.os.Bundle;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.model.ModelPatient;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.staff.detail.presenter.IStaffDetailPresenter;
import patient.telehealth.redimed.workinjury.staff.detail.view.IStaffDetailView;
import patient.telehealth.redimed.workinjury.utils.Key.Staff;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by MeditekMini on 6/7/16.
 */
public class StaffDetailPresenter implements IStaffDetailPresenter {

    private String TAG = Staff.TAG;
    private IStaffDetailView iStaffDetailView;
    private MyApplication application;
    private ModelPatient[] modelPatient;
    private Gson gson;


    public StaffDetailPresenter(IStaffDetailView iStaffDetailView) {
        this.iStaffDetailView = iStaffDetailView;

        application = MyApplication.getInstance();
        gson = new Gson();
    }

    @Override
    public void getDetailStaff(Bundle bundle) {
        String staffUid = bundle.getString(Staff.staffUid);
        JsonObject objData = new JsonObject();
        objData.addProperty(Staff.data, application.parseToJson(new String[]{Staff.UID, staffUid}));
        RESTClient.getTelehealthApi().getDetailPatient(objData, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject object, Response response) {
                modelPatient = gson.fromJson(object.get(Staff.data).getAsJsonArray(), ModelPatient[].class);

                iStaffDetailView.StaffDetail(modelPatient[0]);
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
    }
}


