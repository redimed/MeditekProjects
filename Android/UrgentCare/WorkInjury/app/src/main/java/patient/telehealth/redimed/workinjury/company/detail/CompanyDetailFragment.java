package patient.telehealth.redimed.workinjury.company.detail;


import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.model.ModelCompany;
import patient.telehealth.redimed.workinjury.company.detail.presenter.CompanyDetailPresenter;
import patient.telehealth.redimed.workinjury.company.detail.presenter.ICompanyDetailPresenter;
import patient.telehealth.redimed.workinjury.company.detail.view.ICompanyDetailView;
import patient.telehealth.redimed.workinjury.setting.SettingFragment;
import patient.telehealth.redimed.workinjury.utils.Key;
import patient.telehealth.redimed.workinjury.utils.Key.Company;


/**
 * A simple {@link Fragment} subclass.
 */
public class CompanyDetailFragment extends Fragment implements ICompanyDetailView{

    private ICompanyDetailPresenter iCompanyDetailPresenter;
    private MyApplication application;

    @Bind(R.id.lblName) TextView lblName;
    @Bind(R.id.lblAddress) TextView lblAddress;
    @Bind(R.id.lblSuburb) TextView lblSuburb;
    @Bind(R.id.lblPostCode) TextView lblPostCode;

    public CompanyDetailFragment() {
        // Required empty public constructor
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        iCompanyDetailPresenter = new CompanyDetailPresenter(this);
        iCompanyDetailPresenter.getDetailCompany(getArguments());
        application = MyApplication.getInstance();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_company_detail, container, false);
        ButterKnife.bind(this, view);
        setHasOptionsMenu(true);
        application.createTooBarTitle(view, Company.companyDetail);

        return view;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                application.replaceFragment(new SettingFragment(), Key.fmSetting, Key.fmHome);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void LoadCompanyDetail(ModelCompany modelCompany) {
        lblName.setText(String.valueOf(application.getDataSharedPreferences(Key.companyName, Key.defalt)));
        lblAddress.setText(String.valueOf(modelCompany.getAddress1()));
        lblSuburb.setText(String.valueOf(modelCompany.getSuburb()));
        lblPostCode.setText(String.valueOf(modelCompany.getPostcode()));
    }
}
