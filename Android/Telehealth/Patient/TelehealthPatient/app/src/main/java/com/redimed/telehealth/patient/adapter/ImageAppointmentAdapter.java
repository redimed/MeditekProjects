package com.redimed.telehealth.patient.adapter;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.Drawable;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.model.GlideUrl;
import com.bumptech.glide.load.model.LazyHeaders;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.utlis.DefineKey;
import com.redimed.telehealth.patient.widget.DialogViewImage;

import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

public class ImageAppointmentAdapter extends RecyclerView.Adapter<ImageAppointmentAdapter.ImageListViewHolder> {

    private Context context;
    private LayoutInflater inflater;
    private List<String> fileUploads;
    private SharedPreferences telehealthPatient;
    private static final String TAG = "=====ADAPTER_IMG=====";

    public ImageAppointmentAdapter(Context context, List<String> fileUploads, SharedPreferences tele) {
        this.context = context;
        this.telehealthPatient = tele;
        this.fileUploads = fileUploads;
        this.inflater = LayoutInflater.from(context);
    }

    @Override
    public ImageListViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = inflater.inflate(R.layout.cardview_image_appointment, parent, false);
        return new ImageListViewHolder(view);
    }

    @Override
    public void onBindViewHolder(final ImageListViewHolder holder, final int position) {
        holder.progressBar.setVisibility(View.VISIBLE);

        GlideUrl glideUrl = new GlideUrl(fileUploads.get(position), new LazyHeaders.Builder()
                .addHeader("AppID", DefineKey.AppID)
                .addHeader("SystemType", DefineKey.SystemType)
                .addHeader("Cookie", telehealthPatient.getString("cookie", ""))
                .addHeader("DeviceID", telehealthPatient.getString("deviceID", ""))
                .addHeader("Authorization", "Bearer " + telehealthPatient.getString("token", ""))
                .build());

        int myWidth = 300;
        int myHeight = 300;
        Glide.with(context).load(glideUrl)
                .asBitmap()
                .into(new SimpleTarget<Bitmap>(myWidth, myHeight) {
                    @Override
                    public void onResourceReady(Bitmap resource, GlideAnimation glideAnimation) {
                        holder.progressBar.setVisibility(View.GONE);
                        holder.imgContains.setImageBitmap(resource);
                    }

                    @Override
                    public void onLoadFailed(Exception e, Drawable errorDrawable) {
                        Bitmap errorBitmap = BitmapFactory.decodeResource(context.getResources(), R.drawable.icon_error_image);
                        holder.imgContains.setImageBitmap(errorBitmap);
                    }
                });
    }

    @Override
    public int getItemCount() {
        return fileUploads.size();
    }

    public class ImageListViewHolder extends RecyclerView.ViewHolder {

        @Bind(R.id.imgContains)
        ImageView imgContains;
        @Bind(R.id.progressBar)
        ProgressBar progressBar;

        public ImageListViewHolder(View itemView) {
            super(itemView);
            ButterKnife.bind(this, itemView);

            itemView.setClickable(true);
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    DialogViewImage(context, getAdapterPosition());
                }
            });
        }
    }

    public void DialogViewImage(Context context, int position) {
        new DialogViewImage(context, fileUploads.get(position)).show();
    }
}