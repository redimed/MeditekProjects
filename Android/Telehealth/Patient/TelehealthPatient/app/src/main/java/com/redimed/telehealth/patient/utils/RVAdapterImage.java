package com.redimed.telehealth.patient.utils;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.support.v7.widget.RecyclerView;
import android.util.Log;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import android.widget.ImageView;
import android.widget.ProgressBar;

import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.bumptech.glide.Glide;
import com.bumptech.glide.load.model.GlideUrl;
import com.bumptech.glide.load.model.LazyHeaders;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;
import com.redimed.telehealth.patient.R;

import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

public class RVAdapterImage extends RecyclerView.Adapter<RVAdapterImage.ImageListViewHolder> {

    private final Context context;
    private List<String> fileUploads;
    private final LayoutInflater inflater;
    private SharedPreferences telehealthPatient;

    public RVAdapterImage(Context context, List<String> fileUploads, SharedPreferences tele) {
        this.context = context;
        telehealthPatient = tele;
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

//        RequestQueue requestQueue = VolleySingleton.getInstance(context).getRequestQueue();
//        HighPriorityRequest highPriorityRequest = new HighPriorityRequest(
//                fileUploads.get(position),
//                new Response.Listener<Bitmap>() {
//                    @Override
//                    public void onResponse(Bitmap response) {
//                        holder.progressBar.setVisibility(View.GONE);
//                        holder.imgContains.setImageBitmap(response);
//                    }
//                }, 300, 300, null,
//                new Response.ErrorListener() {
//                    @Override
//                    public void onErrorResponse(VolleyError error) {
//                        Log.d("ADAPTER", error.toString());
//                    }
//                }, telehealthPatient) {
//        };
//        requestQueue.add(highPriorityRequest);

        GlideUrl glideUrl = new GlideUrl(fileUploads.get(position), new LazyHeaders.Builder()
                .addHeader("AppID", "com.redimed.telehealth.patient")
                .addHeader("Authorization", "Bearer " + telehealthPatient.getString("token", ""))
                .addHeader("Content-Type", "application/json; charset=utf-8")
                .addHeader("Cookie", telehealthPatient.getString("cookie", ""))
                .addHeader("DeviceID", telehealthPatient.getString("deviceID", ""))
                .addHeader("SystemType", "ARD")
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
                        Log.d("ADAPTER", e.toString());
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
                    DialogViewImage(v.getContext(), getAdapterPosition());
                }
            });
        }
    }

    public void DialogViewImage(Context context, int position) {
        new DialogViewImage(context, fileUploads.get(position)).show();
    }
}