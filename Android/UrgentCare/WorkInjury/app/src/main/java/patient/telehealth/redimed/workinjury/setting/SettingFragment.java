package patient.telehealth.redimed.workinjury.setting;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.setting.presenter.ISettingPresenter;
import patient.telehealth.redimed.workinjury.setting.presenter.SettingPresenter;
import patient.telehealth.redimed.workinjury.setting.view.SettingView;


/**
 * A simple {@link Fragment} subclass.
 */
public class SettingFragment extends Fragment implements SettingView, View.OnClickListener {

    @Bind(R.id.btnBack) LinearLayout btnBack;
    @Bind(R.id.btnLogout) RelativeLayout btnLogout;
    @Bind(R.id.lblUserName) TextView lblUserName;
    @Bind(R.id.lblCompanyName) TextView lblCompanyName;
    @Bind(R.id.layoutAccount) LinearLayout layoutAccount;
    @Bind(R.id.layoutAccountCenter) LinearLayout layoutAccountCenter;
    @Bind(R.id.layoutCompany) RelativeLayout layoutCompany;
    @Bind(R.id.lblCompany) TextView lblCompany;
    @Bind(R.id.lblAccount) TextView lblAccount;
    @Bind(R.id.layoutOther) LinearLayout layoutOther;
    @Bind(R.id.layoutAbountRedimed) RelativeLayout layoutAbountRedimed;

    private boolean isAuthenticated;
    private boolean isTypeCompany;
    private ISettingPresenter iSettingPresenter;

    public SettingFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_setting, container, false);

        ButterKnife.bind(this, view);

        iSettingPresenter = new SettingPresenter(this, getActivity());

        lblUserName.setText(MyApplication.getInstance().getDataSharedPreferences("username","N/A").toString());
        lblCompanyName.setText(MyApplication.getInstance().getDataSharedPreferences("companyName","N/A").toString());
        isAuthenticated = (boolean) MyApplication.getInstance().getDataSharedPreferences("isAuthenticated", false);
        isTypeCompany = (boolean) MyApplication.getInstance().getDataSharedPreferences("isTypeCompany", false);

        if (!isAuthenticated){
            btnLogout.setVisibility(View.GONE);
            lblAccount.setVisibility(View.GONE);
            layoutAccountCenter.setVisibility(View.GONE);
        }
        if (!isTypeCompany){
            lblCompany.setVisibility(View.GONE);
            layoutCompany.setVisibility(View.GONE);
        }
        btnBack.setOnClickListener(this);
        btnLogout.setOnClickListener(this);
        layoutAccount.setOnClickListener(this);
        layoutCompany.setOnClickListener(this);
        layoutOther.setOnClickListener(this);
        layoutAbountRedimed.setOnClickListener(this);
        return view;
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btnBack:
                //startActivity(new Intent(this, HomeActivity111.class));
                break;
            case  R.id.btnLogout:
                iSettingPresenter.Logout();
                break;
            case  R.id.layoutAccount:
                //startActivity(new Intent(this,AccountActivity.class));
                break;
            case R.id.layoutCompany:
                //startActivity(new Intent(getActivity(), SiteListActivity.class));
                break;
            case R.id.layoutAbountRedimed:

                break;
            case R.id.layoutOther:

                break;
        }
    }
}
