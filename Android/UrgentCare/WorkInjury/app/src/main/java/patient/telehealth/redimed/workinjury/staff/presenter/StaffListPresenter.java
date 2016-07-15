package patient.telehealth.redimed.workinjury.staff.presenter;
import android.util.Log;

import com.google.gson.JsonObject;

import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.staff.view.IStaffListView;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by MeditekMini on 6/7/16.
 */
public class StaffListPresenter implements IStaffListPresenter {

    private IStaffListView iStaffListView;
    private MyApplication application;
    private String TAG = "StaffListPresenter";

    public StaffListPresenter(IStaffListView iStaffListView) {
        this.iStaffListView = iStaffListView;
        application = MyApplication.getInstance();
        LoadStaffList();
    }

    @Override
    public void LoadStaffList() {
        String UserUid = String.valueOf(application.getDataSharedPreferences("useruid", ""));

        RESTClient.getCoreApi().getListStaff(UserUid, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                Log.d(TAG, jsonObject+"");
                iStaffListView.StaffList(jsonObject);
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
    }
}
