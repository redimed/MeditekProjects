package patient.telehealth.redimed.workinjury.company.detail.presenter;

import android.os.Bundle;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.model.ModelCompany;
import patient.telehealth.redimed.workinjury.company.detail.view.ICompanyDetailView;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.utils.Key.Company;
import patient.telehealth.redimed.workinjury.utils.Key.Site;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by MeditekMini on 6/3/16.
 */
public class CompanyDetailPresenter implements ICompanyDetailPresenter {

    private String TAG = Company.TAG;
    private MyApplication application;
    private ICompanyDetailView iCompanyDetailView;
    private ModelCompany modelCompany;
    private Gson gson;

    public CompanyDetailPresenter(ICompanyDetailView iCompanyDetailView) {
        this.iCompanyDetailView = iCompanyDetailView;

        application = MyApplication.getInstance();
        gson = new Gson();
    }

    @Override
    public void getDetailCompany(Bundle bundle) {
        String siteUid = bundle.getString(Site.siteUid, null);
        if (siteUid != null && bundle != null){
            JsonObject objData = new JsonObject();
            objData.addProperty(Company.data, application.parseToJson(new String[]{Company.model, Company.companySite, Company.UID ,siteUid}));
            RESTClient.getTelehealthApi().getDetailSite(objData, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    modelCompany = gson.fromJson(jsonObject.get(Company.data).getAsJsonObject(), ModelCompany.class);
                    iCompanyDetailView.LoadCompanyDetail(modelCompany);
                }

                @Override
                public void failure(RetrofitError error) {

                }
            });
        }
    }
}
