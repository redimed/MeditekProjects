package patient.telehealth.redimed.workinjury.setting;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.account.AccountFragment;
import patient.telehealth.redimed.workinjury.pin.PinFragment;
import patient.telehealth.redimed.workinjury.setting.presenter.ISettingPresenter;
import patient.telehealth.redimed.workinjury.setting.presenter.SettingPresenter;
import patient.telehealth.redimed.workinjury.setting.view.SettingView;
import patient.telehealth.redimed.workinjury.company.site.SiteListFragment;
import patient.telehealth.redimed.workinjury.utils.Key;


/**
 * A simple {@link Fragment} subclass.
 */
public class SettingFragment extends Fragment implements SettingView, View.OnClickListener {

    @Bind(R.id.btnLogout) RelativeLayout btnLogout;
    @Bind(R.id.lblUserName) TextView lblUserName;
    @Bind(R.id.lblCompanyName) TextView lblCompanyName;
    @Bind(R.id.layoutAccount) LinearLayout layoutAccount;
    @Bind(R.id.layoutAccountCenter) LinearLayout layoutAccountCenter;
    @Bind(R.id.layoutCompany) RelativeLayout layoutCompany;
    @Bind(R.id.lblCompany) TextView lblCompany;
    @Bind(R.id.lblAccount) TextView lblAccount;
    @Bind(R.id.layoutChangePin) RelativeLayout layoutChangePin;
    @Bind(R.id.layoutOther) LinearLayout layoutOther;
    @Bind(R.id.layoutAbountRedimed) RelativeLayout layoutAbountRedimed;

    private boolean isAuthenticated;
    private boolean isTypeCompany;
    private ISettingPresenter iSettingPresenter;
    private MyApplication application;
    private String username;
    private String companyName;

    public SettingFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        iSettingPresenter = new SettingPresenter(this, getActivity());
        application = MyApplication.getInstance();

        isAuthenticated = (boolean) application.getDataSharedPreferences(Key.isAuthenticated, false);
        isTypeCompany = (boolean) application.getDataSharedPreferences(Key.isTypeCompany, false);
        username = (String) application.getDataSharedPreferences(Key.username, Key.defaltNA);
        companyName = (String) application.getDataSharedPreferences(Key.companyName, Key.defaltNA);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_setting, container, false);

        ButterKnife.bind(this, view);

        setHasOptionsMenu(true);
        application.createTooBarTitle(view, Key.fmSetting);

        lblUserName.setText(username);
        lblCompanyName.setText(companyName);

        if (!isAuthenticated){
            btnLogout.setVisibility(View.GONE);
            lblAccount.setVisibility(View.GONE);
            layoutAccountCenter.setVisibility(View.GONE);
        }

        if (!isTypeCompany){
            lblCompany.setVisibility(View.GONE);
            layoutCompany.setVisibility(View.GONE);
        }

        btnLogout.setOnClickListener(this);
        layoutAccount.setOnClickListener(this);
        layoutCompany.setOnClickListener(this);
        layoutOther.setOnClickListener(this);
        layoutAbountRedimed.setOnClickListener(this);
        layoutChangePin.setOnClickListener(this);
        return view;
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case  R.id.btnLogout:
                iSettingPresenter.Logout();
                break;
            case  R.id.layoutAccount:
                application.replaceFragment(new AccountFragment(), Key.fmAccount, Key.fmSetting);
                break;
            case R.id.layoutCompany:
                application.replaceFragment(new SiteListFragment(), Key.fmSiteList, Key.fmSetting);
                break;
            case R.id.layoutAbountRedimed:
                iSettingPresenter.displayFAQs(Key.FAQ.titleAboutUs);
                break;
            case R.id.layoutOther:
                iSettingPresenter.displayFAQs(Key.FAQ.titleService);
                break;
            case R.id.layoutChangePin:
                application.replaceFragment(new PinFragment(), Key.fmChangePin, Key.fmSetting);
                break;
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                application.BackFragment(Key.fmHome, Key.fmHome);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }
}
