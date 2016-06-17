package com.redimed.telehealth.patient.information;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AlertDialog;
import android.support.v7.widget.Toolbar;
import android.text.Html;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.AutoCompleteTextView;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ViewFlipper;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.information.presenter.IInfoPresenter;
import com.redimed.telehealth.patient.information.presenter.InfoPresenter;
import com.redimed.telehealth.patient.information.view.IInfoView;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.network.Config;
import com.redimed.telehealth.patient.setting.SettingFragment;
import com.redimed.telehealth.patient.widget.DialogConnection;
import com.redimed.telehealth.patient.utlis.UploadFile;
import com.redimed.telehealth.patient.views.SignaturePad;

import java.io.File;
import java.util.ArrayList;

import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;

/**
 * Created by Fox on 1/14/2016.
 */
public class InformationFragment extends Fragment implements IInfoView, View.OnClickListener {

    private Uri fileUri;
    private Context context;
    private Fragment fragment;
    private boolean flagSign = false;
    private IInfoPresenter iInfoPresenter;
    private SweetAlertDialog progressDialog;
    private ArrayList<EditText> arrEditText;
    private static final int RESULT_PHOTO = 1;
    private static final int RESULT_CAMERA = 2;
    private static final int MEDIA_TYPE_IMAGE = 1;
    private static final String TAG = "======INFORMATION=====";

    @Bind(R.id.progressBarUpload)
    ProgressBar progressBarUpload;

    @Bind(R.id.swipeInfo)
    SwipeRefreshLayout swipeInfo;
    @Bind(R.id.scrollViewInfo)
    ScrollView scrollViewInfo;

    /* Fields Information Patient */
    @Bind(R.id.avatarPatient)
    ImageView avatarPatient;
    @Bind(R.id.lblNamePatient)
    TextView lblNamePatient;
    @Bind(R.id.lblPhoneNumber)
    TextView lblPhoneNumber;
    @Bind(R.id.lblDOB)
    TextView lblDOB;
    @Bind(R.id.txtEmail)
    EditText txtEmail;
    @Bind(R.id.txtHomePhone)
    EditText txtHomePhone;
    @Bind(R.id.txtAddress)
    EditText txtAddress;
    @Bind(R.id.autoCompleteSuburb)
    AutoCompleteTextView autoCompleteSuburb;
    @Bind(R.id.txtPostCode)
    EditText txtPostCode;
    @Bind(R.id.autoCompleteCountry)
    AutoCompleteTextView autoCompleteCountry;
    @Bind(R.id.layoutPatientName)
    LinearLayout layoutPatientName;
    @Bind(R.id.txtFirstName)
    EditText txtFirstName;
    @Bind(R.id.txtMidName)
    EditText txtMidName;
    @Bind(R.id.txtLastName)
    EditText txtLastName;
    @Bind(R.id.txtDOB)
    EditText txtDOB;
    @Bind(R.id.lblEmail)
    TextView lblEmail;
    //Button Update Profile
    @Bind(R.id.lblUpdateProfile)
    TextView lblUpdateProfile;

    /* View Flipper contain button to update profile */
    @Bind(R.id.vfContainerProfile)
    ViewFlipper vfContainerProfile;
    // Contain button to update
    @Bind(R.id.layoutButtonUpdate)
    LinearLayout layoutButtonUpdate;
    // Contain button to submit or cancel
//    @Bind(R.id.layoutUpdateProfile)
//    RelativeLayout layoutUpdateProfile;
    // Button to cancel or submit update information
    @Bind(R.id.lblSubmit)
    TextView btnSubmit;
    @Bind(R.id.lblCancel)
    TextView btnCancel;

    /* View Flipper contain layout signature image & signature pad*/
    @Bind(R.id.vfContainerSignature)
    ViewFlipper vfContainerSignature;
    // Layout contain to show signature image
    @Bind(R.id.layoutSignatureImage)
    RelativeLayout layoutSignatureImage;
    @Bind(R.id.imgSignature)
    ImageView imgSignature;
    @Bind(R.id.lblNoSign)
    TextView lblNoSign;
    // Layout contain to show signature pad
    @Bind(R.id.layoutSignaturePad)
    LinearLayout layoutSignaturePad;
    @Bind(R.id.signaturePad)
    SignaturePad signaturePad;

    /* Button to open layout button signature */
    @Bind(R.id.lblEdit)
    TextView btnEdit;
    // Layout contain button to clear, save signature
    @Bind(R.id.layoutButtonSignature)
    LinearLayout layoutButtonSignature;
    @Bind(R.id.lblSave)
    TextView btnSaveSign;
    @Bind(R.id.lblClear)
    TextView btnClear;

    /* Toolbar */
    @Bind(R.id.toolBar)
    Toolbar toolBar;

    public InformationFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_information, container, false);
        setHasOptionsMenu(true);
        context = v.getContext();
        ButterKnife.bind(this, v);

        iInfoPresenter = new InfoPresenter(this, context, getActivity());
        iInfoPresenter.initToolbar(toolBar);
        iInfoPresenter.hideKeyboardFragment(v);

        initVariable();
        SwipeRefresh();
        initSignature();

        lblNoSign.setOnClickListener(this);
        btnSubmit.setOnClickListener(this);
        btnCancel.setOnClickListener(this);
        btnEdit.setOnClickListener(this);
        btnClear.setOnClickListener(this);
        btnSaveSign.setOnClickListener(this);
        avatarPatient.setOnClickListener(this);
        lblUpdateProfile.setOnClickListener(this);

        txtDOB.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (hasFocus) {
                    txtDOB.setError(null);
                    iInfoPresenter.displayDatePickerDialog();
                }
            }
        });

        return v;
    }

    private void initSignature() {
        signaturePad.setOnSignedListener(new SignaturePad.OnSignedListener() {
            @Override
            public void onStartSigning() {
                flagSign = true;
                btnClear.setText(getResources().getString(R.string.sign_clear));
                Toast.makeText(context, "OnStartSigning", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onSigned() {
                btnSaveSign.setEnabled(true);
            }

            @Override
            public void onClear() {
                btnSaveSign.setEnabled(false);
                btnClear.setText(getResources().getString(R.string.sign_cancel));
            }
        });
    }

    private void initVariable() {

        Bundle bundle = getArguments();
        if (bundle != null) {
            iInfoPresenter.getInfoPatient(bundle.getString("telehealthUID", ""));
        }

        //init array EditText
        arrEditText = new ArrayList<>();
        arrEditText.add(txtFirstName);
        arrEditText.add(txtMidName);
        arrEditText.add(txtLastName);
        arrEditText.add(txtDOB);
        arrEditText.add(txtHomePhone);
        arrEditText.add(txtAddress);
        arrEditText.add(txtPostCode);
        arrEditText.add(txtEmail);

        //init Suburb
        if (iInfoPresenter.loadJsonSuburb() != null) {
            autoCompleteSuburb.setThreshold(1);
            autoCompleteSuburb.setAdapter(iInfoPresenter.loadJsonSuburb());
        }

        if (iInfoPresenter.loadJsonCountry() != null) {
            autoCompleteCountry.setThreshold(1);
            autoCompleteCountry.setAdapter(iInfoPresenter.loadJsonCountry());
        }

        //init progressDialog
        progressDialog = new SweetAlertDialog(context, SweetAlertDialog.PROGRESS_TYPE);
        progressDialog.getProgressHelper().setBarColor(Color.parseColor("#B42047"));
        progressDialog.setTitleText("Loading");
        progressDialog.setCancelable(false);
        progressDialog.show();
    }

    //Refresh information patient
    private void SwipeRefresh() {
        swipeInfo.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                onReload();
            }
        });

        swipeInfo.setColorSchemeResources(android.R.color.holo_blue_bright,
                android.R.color.holo_green_light,
                android.R.color.holo_orange_light,
                android.R.color.holo_red_light);

        scrollViewInfo.post(new Runnable() {
            @Override
            public void run() {
                scrollViewInfo.fullScroll(ScrollView.FOCUS_UP);
                scrollViewInfo.scrollTo(0, 0);
            }
        });

        scrollViewInfo.getViewTreeObserver().addOnScrollChangedListener(new ViewTreeObserver.OnScrollChangedListener() {
            @Override
            public void onScrollChanged() {
                int scrollY = scrollViewInfo.getScrollY();
                if (scrollY == 0) {
                    swipeInfo.setEnabled(true);
                } else swipeInfo.setEnabled(false);
            }
        });
        swipeInfo.setRefreshing(false);
    }

    //Show information Patient
    @Override
    public void displayInfo(Patient[] patients) {
        if (patients != null) {
            String firstName, lastName, midName;
            for (Patient patient : patients) {
                firstName = patient.getFirstName() == null ? "NONE" : patient.getFirstName();
                midName = patient.getMiddleName() == null ? " " : patient.getMiddleName();
                lastName = patient.getLastName() == null ? " " : patient.getLastName();
                lblNamePatient.setText(firstName + " " + midName + " " + lastName);
                lblPhoneNumber.setText(patient.getPhoneNumber());
                txtHomePhone.setText(patient.getHomePhoneNumber() == null ? "NONE" : patient.getHomePhoneNumber());
                txtEmail.setText(patient.getEmail() == null ? "NONE" : patient.getEmail());
                lblEmail.setText(patient.getEmail() == null ? "NONE" : patient.getEmail());
                lblDOB.setText(patient.getDOB() == null ? "NONE" : patient.getDOB());
                txtAddress.setText(patient.getAddress1() == null ? "NONE" : patient.getAddress1());
                autoCompleteSuburb.setText(patient.getSuburb() == null ? "NONE" : patient.getSuburb());
                txtPostCode.setText(patient.getPostCode() == null ? "NONE" : patient.getPostCode());
                autoCompleteCountry.setText(patient.getCountryName() == null ? "NONE" : patient.getCountryName());

                txtFirstName.setText(firstName);
                txtMidName.setText(midName);
                txtLastName.setText(lastName);
                txtDOB.setText(patient.getDOB() == null ? "NONE" : patient.getDOB());

                //Call presenter load avatar
                iInfoPresenter.loadAvatar(Config.apiURLDownload + patient.getProfileImage());

                //On Load Signature
                if (patient.getSignature() == null) {
                    String str = "No Signature to show <u><i>click here</i></u> to generate";
                    lblNoSign.setText(Html.fromHtml(str));
                    lblNoSign.setVisibility(View.VISIBLE);
                } else {
                    iInfoPresenter.downloadSignature(Config.apiURLDownload + patient.getSignature());
                }
            }
        }
        progressDialog.dismiss();
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        // Inflate the menu; this adds items to the action bar if it is present.
        inflater.inflate(R.menu.menu_main, menu);
        super.onCreateOptionsMenu(menu, inflater);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
                /* Handle action bar item clicks here. The action bar will automatically handle clicks on the Home/Up button,
            so long as you specify a parent activity in AndroidManifest.xml.
        */
        switch (item.getItemId()) {
            case android.R.id.home:
                fragment = new SettingFragment();
                fragment.setArguments(getArguments());
                iInfoPresenter.changeFragment(fragment);
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
    }

    //Load image avatar
    @Override
    public void onLoadAvatar(Bitmap bitmap) {
        if (bitmap != null) {
            avatarPatient.setImageBitmap(bitmap);
        }
    }

    @Override
    public void onReload() {
        for (EditText editText : arrEditText) {
            editText.setError(null);
        }
        FragmentTransaction ft = getFragmentManager().beginTransaction();
        ft.detach(this).attach(this).commit();
    }

    @Override
    public void onLoadDOB(String dob) {
        txtDOB.setText(dob);
    }

    @Override
    public void onResultField(EditText editText) {
        if (editText != null) {
            editText.requestFocus(); // Scrolls view to this field.
            editText.setError(getResources().getString(R.string.field_empty));
        }
    }

    @Override
    public void onResultEmail(boolean email) {
        if (!email) {
            txtEmail.setText("");
            txtEmail.requestFocus();
            txtEmail.setError(getResources().getString(R.string.email_valid));
        }
    }

    @Override
    public void onLoadSignature(Bitmap bitmap, String pathSign) {
        if (bitmap != null) {
            imgSignature.setImageBitmap(bitmap);
            lblNoSign.setVisibility(View.VISIBLE);
            if (pathSign != null)
                new UploadFile(context, progressBarUpload, "Signature", pathSign).execute();
        }
    }

    @Override
    public void onLoadError(String msg) {
        if (msg.equalsIgnoreCase("Network Error")) {
            new DialogConnection(context).show();
        } else if (msg.equalsIgnoreCase("TokenExpiredError")) {
            new SweetAlertDialog(context, SweetAlertDialog.WARNING_TYPE)
                    .setContentText(getResources().getString(R.string.token_expired))
                    .show();
        } else {
            new SweetAlertDialog(context, SweetAlertDialog.ERROR_TYPE)
                    .setContentText(msg)
                    .show();
        }
        progressDialog.dismiss();
    }

    //Handler back button
    @Override
    public void onResume() {
        super.onResume();
        if (getView() != null) {
            getView().setFocusableInTouchMode(true);
            getView().requestFocus();
            getView().setOnKeyListener(new View.OnKeyListener() {
                @Override
                public boolean onKey(View v, int keyCode, KeyEvent event) {
                    if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                        fragment = new SettingFragment();
                        fragment.setArguments(getArguments());
                        iInfoPresenter.changeFragment(fragment);
                        return true;
                    }
                    return false;
                }
            });
        }
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.lblUpdateProfile:
                ChangeViewUpdate();
                break;
            case R.id.lblSubmit:
                iInfoPresenter.updateProfile(arrEditText, autoCompleteSuburb.getText().toString(), autoCompleteCountry.getText().toString());
                break;
            case R.id.lblClear:
                if (!flagSign) {
                    btnEdit.setVisibility(View.VISIBLE);
                    layoutButtonSignature.setVisibility(View.GONE);
                    vfContainerSignature.setDisplayedChild(vfContainerSignature.indexOfChild(layoutSignatureImage));
                }
                flagSign = false;
                signaturePad.clear();
                break;
            case R.id.lblSave:
                iInfoPresenter.saveBitmapSign(signaturePad);
                break;
            case R.id.lblNoSign:
                btnEdit.setVisibility(View.GONE);
                layoutButtonSignature.setVisibility(View.VISIBLE);
                vfContainerSignature.setDisplayedChild(vfContainerSignature.indexOfChild(layoutSignaturePad));
                break;
            case R.id.avatarPatient:
                DialogUploadImage();
                break;
            case R.id.lblCancel:
                onReload();
                break;
            case R.id.lblEdit:
                btnEdit.setVisibility(View.GONE);
                layoutButtonSignature.setVisibility(View.VISIBLE);
                vfContainerSignature.setDisplayedChild(vfContainerSignature.indexOfChild(layoutSignaturePad));
                break;
        }
    }

    private void ChangeViewUpdate() {
        layoutPatientName.setVisibility(View.VISIBLE);
        for (EditText editText : arrEditText) {
            editText.setEnabled(true);
        }
        autoCompleteSuburb.setEnabled(true);
        autoCompleteCountry.setEnabled(true);
        vfContainerProfile.setDisplayedChild(vfContainerProfile.indexOfChild(layoutButtonUpdate));
    }

    //Display dialog choose camera or gallery to upload image
    private void DialogUploadImage() {
        AlertDialog alertDialog = new AlertDialog.Builder(context).create();
        alertDialog.setTitle("Choose an action");
        alertDialog.setMessage("Choose an action Camera or Gallery");

        alertDialog.setButton(Dialog.BUTTON_NEGATIVE, "Gallery", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Intent galleryIntent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                startActivityForResult(galleryIntent, RESULT_PHOTO);
            }
        });

        alertDialog.setButton(Dialog.BUTTON_POSITIVE, "Camera", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                fileUri = iInfoPresenter.getOutputMediaFileUri(MEDIA_TYPE_IMAGE);
                cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, fileUri);
                startActivityForResult(cameraIntent, RESULT_CAMERA);
            }
        });
        alertDialog.show();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        Cursor cursor;
        int columnIndex;
        String picturePath = "";
        try {
            getActivity();
            if (resultCode == Activity.RESULT_OK) {
                switch (requestCode) {
                    case RESULT_PHOTO:
                        //Get uri image
                        Uri selectedImage = data.getData();
                        String[] filePathColumn = {MediaStore.Images.Media.DATA};
                        //Get cursor
                        cursor = context.getContentResolver().query(selectedImage, filePathColumn, null, null, null);
                        assert cursor != null;
                        cursor.moveToFirst();
                        //Get path form cursor index
                        columnIndex = cursor.getColumnIndex(filePathColumn[0]);
                        picturePath = cursor.getString(columnIndex);
                        cursor.close();
                        break;

                    case RESULT_CAMERA:
                        // Downsizing image as it throws OutOfMemory Exception for larger images
                        picturePath = fileUri.getPath();
                        break;

                }
                showImage(picturePath);
                new UploadFile(context, progressBarUpload, "ProfileImage", picturePath).execute();
            } else {
                Toast.makeText(context, "You haven't picked Image", Toast.LENGTH_LONG).show();
            }
        } catch (Exception ex) {
            Log.d(TAG, ex.getLocalizedMessage());
        }
    }

    private void showImage(String path) {
        File imgFile = new File(path);
        if (imgFile.exists()) {
            Bitmap myBitmap = BitmapFactory.decodeFile(imgFile.getAbsolutePath());
            avatarPatient.setImageBitmap(myBitmap);
        }
    }
}
