package patient.telehealth.redimed.workinjury.redisite.image;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.GridView;
import android.widget.TextView;
import java.util.ArrayList;
import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.model.CustomGallery;
import patient.telehealth.redimed.workinjury.redisite.consent.ConsentFragment;
import patient.telehealth.redimed.workinjury.redisite.illness.GeneralFragment;
import patient.telehealth.redimed.workinjury.redisite.image.adapter.ImageAdapter;
import patient.telehealth.redimed.workinjury.redisite.image.presenter.IImagePresenter;
import patient.telehealth.redimed.workinjury.redisite.image.presenter.ImagePresenter;
import patient.telehealth.redimed.workinjury.redisite.image.view.IImageView;
import patient.telehealth.redimed.workinjury.redisite.injury.InjuryFragment;
import patient.telehealth.redimed.workinjury.utils.Key;

/**
 * A simple {@link Fragment} subclass.
 */
public class ImageFragment extends Fragment implements IImageView, View.OnClickListener {

    private Uri fileUri;
    private Context context;
    private IImagePresenter iImagePresenter;
    private static final int RESULT_PHOTO = 1;
    private static final int RESULT_CAMERA = 2;
    private static final int MEDIA_TYPE_IMAGE = 1;
    private ArrayList<CustomGallery> customGalleries;
    private static final String TAG = "=====IMAGE=====";

    protected MyApplication application;

    @Bind(R.id.lblImage) TextView lblImage;
    @Bind(R.id.gridImageSelected) GridView gridImageSelected;
    @Bind(R.id.btnImageSelected) Button btnImageSelected;

    public ImageFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.context = getContext();
        this.customGalleries = new ArrayList<>();
        this.application = (MyApplication) context.getApplicationContext();
        this.iImagePresenter = new ImagePresenter(context, this, getActivity());
        this.customGalleries = application.getCustomGalleries();
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        setHasOptionsMenu(true);
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
        getActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_VISIBLE | WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);

        View v = inflater.inflate(R.layout.fragment_image, container, false);
        ButterKnife.bind(this, v);
        application.createTooBarMenu(v);

        if (customGalleries.size() > 0){
            onLoadGallery(customGalleries);
        }

        btnImageSelected.setOnClickListener(this);

        return v;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == Activity.RESULT_OK) {
            switch (requestCode) {
                case RESULT_PHOTO:
                    String[] allPath = data.getStringArrayExtra("all_path");
                    customGalleries.addAll(iImagePresenter.setImageGallery(allPath));

                    onLoadGallery(customGalleries);
                    break;
                case RESULT_CAMERA:
                    CustomGallery item = new CustomGallery();
                    item.sdcardPath = fileUri.getPath();
                    customGalleries.add(item);

                    onLoadGallery(customGalleries);
                    break;
                default:
                    break;
            }
            application.setCustomGalleries(customGalleries);
        }
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        inflater.inflate(R.menu.menu_redisite_image, menu);
        super.onCreateOptionsMenu(menu, inflater);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        /* Handle action bar item clicks here. The action bar will automatically handle clicks on the Home/Up button,
            so long as you specify a parent activity in AndroidManifest.xml.
        */
        switch (item.getItemId()) {
            case android.R.id.home:
                if (application.getRedisiteInjury())
                    application.replaceFragment(new InjuryFragment(), Key.fmRedisiteInjury, Key.fmRedisitePatient);
                else
                    application.replaceFragment(new GeneralFragment(), Key.fmRedisiteIllness, Key.fmRedisitePatient);
                return true;
            case R.id.action_gallery:
                try {
                    Intent galleryIntent = new Intent("ACTION_MULTIPLE_PICK");
                    startActivityForResult(galleryIntent, RESULT_PHOTO);
                }catch (Exception e){
                    Log.d("action_gallery", e.getMessage());
                    application.FunctionError("Select Gallery Error");
                }
                return true;
            case R.id.action_camera:
                try {
                    Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                    fileUri = iImagePresenter.getOutputMediaFileUri(MEDIA_TYPE_IMAGE);
                    cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, fileUri);
                    startActivityForResult(cameraIntent, RESULT_CAMERA);
                }catch (Exception e){
                    Log.d("action_camera", e.getMessage());
                    application.FunctionError("Select Camera Error");
                }

                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void onLoadGallery(ArrayList<CustomGallery> customGalleries) {
        if (customGalleries.size() > 0)
            lblImage.setVisibility(View.GONE);

        ImageAdapter imageAdapter = new ImageAdapter(context, customGalleries);
        gridImageSelected.setAdapter(imageAdapter);
    }

    @Override
    public void onClick(View view) {
        application.replaceFragment(new ConsentFragment(), Key.fmRedisiteConsent, Key.fmRedisiteImage);
    }
}
