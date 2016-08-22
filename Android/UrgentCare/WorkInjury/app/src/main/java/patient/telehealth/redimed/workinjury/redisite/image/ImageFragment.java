package patient.telehealth.redimed.workinjury.redisite.image;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
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
import patient.telehealth.redimed.workinjury.model.Singleton;
import patient.telehealth.redimed.workinjury.redisite.consent.ConsentFragment;
import patient.telehealth.redimed.workinjury.redisite.illness.GeneralFragment;
import patient.telehealth.redimed.workinjury.redisite.image.adapter.ImageAdapter;
import patient.telehealth.redimed.workinjury.redisite.image.presenter.IImagePresenter;
import patient.telehealth.redimed.workinjury.redisite.image.presenter.ImagePresenter;
import patient.telehealth.redimed.workinjury.redisite.image.view.IImageView;
import patient.telehealth.redimed.workinjury.redisite.injury.InjuryFragment;

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

    @Bind(R.id.toolBar) Toolbar toolBar;
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
        getActivity().getWindow().setStatusBarColor(getResources().getColor(R.color.colorPrimaryNew));
        getActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_VISIBLE | WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);

        View v = inflater.inflate(R.layout.fragment_image, container, false);
        ButterKnife.bind(this, v);

        if (customGalleries.size() > 0){
            onLoadGallery(customGalleries);
        }

        onLoadToolbar();

        btnImageSelected.setOnClickListener(this);

        return v;
    }

    private Fragment setFlagFragment() {
        Bundle bundle = new Bundle();
        if (getArguments().getString("flagFragment").equalsIgnoreCase("injury")) {
            bundle.putString("flagFragment", "injury");
        } else {
            bundle.putString("flagFragment", "general");
        }
        Fragment fragment = new ConsentFragment();
        fragment.setArguments(bundle);
        return fragment;
    }

    private void onLoadToolbar() {
        //init toolbar
        AppCompatActivity appCompatActivity = (AppCompatActivity) getActivity();
        appCompatActivity.setSupportActionBar(toolBar);
        toolBar.setOverflowIcon(ContextCompat.getDrawable(context, R.drawable.icon_plus));

        ActionBar actionBar = appCompatActivity.getSupportActionBar();
        if (actionBar != null) {
            actionBar.setHomeButtonEnabled(true);
            actionBar.setTitle(getResources().getString(R.string.title_image));

            actionBar.setDisplayShowHomeEnabled(true); // show or hide the default home button
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowCustomEnabled(true); // enable overriding the default toolbar layout
            actionBar.setDisplayShowTitleEnabled(true); // disable the default title element here (for centered title)

            // Change color image back, set a custom icon for the default home button
            final Drawable upArrow = ContextCompat.getDrawable(context, R.drawable.abc_ic_clear_material);
            upArrow.setColorFilter(ContextCompat.getColor(context, R.color.lightFont), PorterDuff.Mode.SRC_ATOP);
            actionBar.setHomeAsUpIndicator(upArrow);
        }
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
                if (getArguments().getString("flagFragment").equalsIgnoreCase("injury"))
                    application.ReplaceFragment(new InjuryFragment());
                else
                    application.ReplaceFragment(new GeneralFragment());
                return true;
            case R.id.action_gallery:
                Intent galleryIntent = new Intent("ACTION_MULTIPLE_PICK");
                startActivityForResult(galleryIntent, RESULT_PHOTO);
                return true;
            case R.id.action_camera:
                Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                fileUri = iImagePresenter.getOutputMediaFileUri(MEDIA_TYPE_IMAGE);
                cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, fileUri);
                startActivityForResult(cameraIntent, RESULT_CAMERA);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void onLoadGallery(ArrayList<CustomGallery> customGalleries) {
//        Singleton.getInstance().setCustomGalleries(customGalleries);
        if (customGalleries.size() > 0)
            lblImage.setVisibility(View.GONE);

        ImageAdapter imageAdapter = new ImageAdapter(context, customGalleries);
        gridImageSelected.setAdapter(imageAdapter);
    }

    @Override
    public void onClick(View view) {
        application.ReplaceFragment(setFlagFragment());
    }
}
