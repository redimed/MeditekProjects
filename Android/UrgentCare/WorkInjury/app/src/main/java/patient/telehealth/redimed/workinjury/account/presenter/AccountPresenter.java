package patient.telehealth.redimed.workinjury.account.presenter;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import org.jdeferred.Deferred;
import org.jdeferred.Promise;
import org.jdeferred.impl.DeferredObject;

import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.account.view.IAccountView;
import patient.telehealth.redimed.workinjury.model.ModelAccount;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.utils.Key;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by MeditekMini on 6/15/16.
 */
public class AccountPresenter implements IAccountPresenter {

    private IAccountView iAccountView;
    private MyApplication application;
    private String TAG = Key.Account.TAG;
    private ModelAccount[] modelAccounts;
    private Gson gson;

    public AccountPresenter(IAccountView iAccountView) {
        this.iAccountView = iAccountView;
        application = MyApplication.getInstance();
        gson = new Gson();
        getAccountInfo();
    }

    @Override
    public void getAccountInfo() {
        String TeleUid = String.valueOf(application.getDataSharedPreferences(Key.teleUid, Key.defalt));
        RESTClient.getTelehealthApi().getDetailAccount(TeleUid, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                modelAccounts = gson.fromJson(jsonObject.get(Key.Account.data).getAsJsonArray(), ModelAccount[].class);
                iAccountView.LoadAccountInfo(modelAccounts[0]);
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
    }

    @Override
    public Promise UpdatePatientInfo(ModelAccount modelPatient) {
        String[] data = {Key.Account.data, gson.toJson(modelPatient)};
        final Deferred deferred = new DeferredObject();
        RESTClient.getTelehealthApi().updatePatient(application.createJson(data), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                deferred.resolve(jsonObject);
            }

            @Override
            public void failure(RetrofitError error) {
                deferred.reject(error);
            }
        });
        return deferred.promise();
    }
}
