package patient.telehealth.redimed.workinjury.account;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.TextView;

import org.jdeferred.DoneCallback;
import org.jdeferred.FailCallback;

import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.account.presenter.AccountPresenter;
import patient.telehealth.redimed.workinjury.account.presenter.IAccountPresenter;
import patient.telehealth.redimed.workinjury.account.view.IAccountView;
import patient.telehealth.redimed.workinjury.models.ModelAccount;
import patient.telehealth.redimed.workinjury.utils.Key;


public class AccountFragment extends Fragment implements IAccountView, View.OnClickListener {

    private MyApplication application;
    private IAccountPresenter iAccountPresenter;
    private String TAG = "AccountFragment";
    private ModelAccount modelAccount;

    @Bind(R.id.lblName)
    TextView lblName;
    @Bind(R.id.lblBookingPerson)
    TextView lblBookingPerson;
    @Bind(R.id.lblMobile)
    TextView lblMobile;
    @Bind(R.id.lblEmail)
    TextView lblEmail;
    @Bind(R.id.txtFirstName)
    TextView txtFirstName;
    @Bind(R.id.txtMiddleName)
    TextView txtMiddleName;
    @Bind(R.id.txtLastName)
    TextView txtLastName;
    @Bind(R.id.txtHomePhone)
    TextView txtHomePhone;
    @Bind(R.id.txtDOB)
    TextView txtDOB;
    @Bind(R.id.txtEmail)
    TextView txtEmail;
    @Bind(R.id.txtAddress)
    TextView txtAddress;
    @Bind(R.id.txtSuburb)
    TextView txtSuburb;
    @Bind(R.id.txtPostCode)
    TextView txtPostCode;
    @Bind(R.id.txtCountry)
    TextView txtCountry;
    @Bind(R.id.btnUpdatePatient)
    TextView btnUpdatePatient;

    public AccountFragment() {

    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        application = MyApplication.getInstance();
        iAccountPresenter = new AccountPresenter(this);
        modelAccount = new ModelAccount();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        getActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_VISIBLE | WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        View view = inflater.inflate(R.layout.fragment_account, container, false);
        ButterKnife.bind(this, view);
        setHasOptionsMenu(true);
        application.hidenKeyboard(view);
        application.createTooBar(view, getActivity(), Key.fmAccount);
        btnUpdatePatient.setOnClickListener(this);
        return view;
    }


    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                application.BackFragment(getActivity(), Key.fmSetting, Key.fmHome);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void LoadAccountInfo(ModelAccount modelAccount) {
        String bookingPersen = ((modelAccount.getFirstName() != null) ? modelAccount.getFirstName() : Key.defalt) + Key.space +
                ((modelAccount.getMiddleName() != null) ? modelAccount.getMiddleName() : Key.defalt) + Key.space +
                ((modelAccount.getLastName() != null) ? modelAccount.getLastName() : Key.defalt);

        lblName.setText(modelAccount.getUserAccount().getUserName());
        lblBookingPerson.setText(bookingPersen);
        lblMobile.setText(modelAccount.getUserAccount().getPhoneNumber());
        lblEmail.setText(modelAccount.getEmail());

        txtFirstName.setText(modelAccount.getFirstName());
        txtLastName.setText(modelAccount.getLastName());
        txtMiddleName.setText((CharSequence) modelAccount.getMiddleName());
        txtHomePhone.setText((CharSequence) modelAccount.getHomePhoneNumber());
        txtDOB.setText(modelAccount.getDOB());
        txtEmail.setText(modelAccount.getEmail());
        txtAddress.setText(modelAccount.getAddress1());
        txtSuburb.setText(modelAccount.getSuburb());
        txtPostCode.setText(modelAccount.getPostcode());
        txtCountry.setText(modelAccount.getCountryName());

        this.modelAccount = modelAccount;
        this.modelAccount.setUserAccount(null);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnUpdatePatient:
                modelAccount.setFirstName(String.valueOf(txtFirstName.getText()));
                modelAccount.setLastName(String.valueOf(txtLastName.getText()));
                modelAccount.setMiddleName(String.valueOf(txtMiddleName.getText()));
                modelAccount.setHomePhoneNumber(String.valueOf(txtHomePhone.getText()));
                modelAccount.setDOB(String.valueOf(txtDOB.getText()));
                modelAccount.setEmail(String.valueOf(txtEmail.getText()));
                modelAccount.setAddress1(String.valueOf(txtAddress.getText()));
                modelAccount.setSuburb(String.valueOf(txtSuburb.getText()));
                modelAccount.setPostcode(String.valueOf(txtPostCode.getText()));
                modelAccount.setCountryName(String.valueOf(txtCountry.getText()));

                final SweetAlertDialog lDialog = new SweetAlertDialog(getActivity(), SweetAlertDialog.PROGRESS_TYPE);
                lDialog.getProgressHelper().setBarColor(R.color.bg_foreign_alert);
                lDialog.setTitleText(". . .");
                lDialog.setCancelable(false);
                lDialog.show();

                iAccountPresenter.UpdatePatientInfo(modelAccount).then(new DoneCallback() {
                    @Override
                    public void onDone(Object result) {
                        lDialog.dismiss();
                        final SweetAlertDialog sDialog = new SweetAlertDialog(getActivity(), SweetAlertDialog.SUCCESS_TYPE);
                        sDialog.setContentText(Key.Account.updatePatientSuccess)
                                .setTitleText(Key.Account.success)
                                .setConfirmClickListener(new SweetAlertDialog.OnSweetClickListener() {
                                    @Override
                                    public void onClick(SweetAlertDialog sDialog) {
                                        iAccountPresenter.getAccountInfo();
                                        sDialog.dismiss();
                                    }
                                })
                                .show();
                    }
                }, new FailCallback() {
                    @Override
                    public void onFail(Object result) {
                        lDialog.dismiss();
                        new SweetAlertDialog(getActivity(), SweetAlertDialog.ERROR_TYPE)
                                .setTitleText(Key.Account.error)
                                .setContentText(Key.Account.updatePatientError)
                                .show();
                    }
                });
                break;
        }
    }
}
