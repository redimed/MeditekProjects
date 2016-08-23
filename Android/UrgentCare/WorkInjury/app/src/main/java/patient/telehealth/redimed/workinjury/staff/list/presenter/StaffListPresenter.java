package patient.telehealth.redimed.workinjury.staff.list.presenter;

import com.google.gson.JsonObject;

import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.staff.list.view.IStaffListView;
import patient.telehealth.redimed.workinjury.utils.Key;
import patient.telehealth.redimed.workinjury.utils.Key.Staff;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by MeditekMini on 6/7/16.
 */
public class StaffListPresenter implements IStaffListPresenter {

    private IStaffListView iStaffListView;
    private MyApplication application;
    private String TAG = Staff.TAG;

    public StaffListPresenter(IStaffListView iStaffListView) {
        this.iStaffListView = iStaffListView;
        application = MyApplication.getInstance();
        LoadStaffList();
    }

    @Override
    public void LoadStaffList() {
        String UserUid = String.valueOf(application.getDataSharedPreferences(Key.useruid, Key.defalt));

        RESTClient.getTelehealthApi().getListStaff(UserUid, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                iStaffListView.StaffList(jsonObject);
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
    }
}
