package com.redimed.telehealth.patient.waiting.presenter;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Bundle;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.model.GlideUrl;
import com.bumptech.glide.load.model.LazyHeaders;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.call.CallActivity;
import com.redimed.telehealth.patient.network.Config;
import com.redimed.telehealth.patient.services.SocketService;
import com.redimed.telehealth.patient.utlis.DeviceUtils;
import com.redimed.telehealth.patient.waiting.view.IWaitingView;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Fox on 1/21/2016.
 */
public class WaitingPresenter implements IWaitingPresenter {

    private Context context;
    private MediaPlayer ringtone;
    private IWaitingView iWaitingView;
    private SharedPreferences telehealthPatient;
    private String sessionId, token, apiKey, to, from, fromName;

    public WaitingPresenter(Context context, IWaitingView iWaitingView) {
        this.context = context;
        this.iWaitingView = iWaitingView;

        telehealthPatient = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
    }

    @Override
    public void listenSocket(Intent i) {
        Bundle extras = i.getExtras();
        if (extras.getString("message", "").equals("call")) {
            sessionId = i.getExtras().getString("sessionId");
            token = i.getExtras().getString("token");
            apiKey = i.getExtras().getString("apiKey");
            to = i.getExtras().getString("to");
            from = i.getExtras().getString("from");

            fromName = i.getExtras().getString("fromName") == null ? "" : i.getExtras().getString("fromName");
            iWaitingView.onLoadNameCaller(fromName);

            LoadImageCaller(Config.apiURLDownload + "test");
        }
    }

    private void LoadImageCaller(String url) {
        GlideUrl glideUrl = new GlideUrl(url, new LazyHeaders.Builder()
                .addHeader("AppID", "com.redimed.telehealth.patient")
                .addHeader("Authorization", "Bearer " + telehealthPatient.getString("token", ""))
                .addHeader("Content-Type", "application/json; charset=utf-8")
                .addHeader("Cookie", telehealthPatient.getString("cookie", ""))
                .addHeader("DeviceID", telehealthPatient.getString("deviceID", ""))
                .addHeader("SystemType", "ARD")
                .build());

        final int myWidth = DeviceUtils.getScreenWidth(context);
        final int myHeight = DeviceUtils.getScreenHeight(context);
        Glide.with(context).load(glideUrl)
                .asBitmap()
                .into(new SimpleTarget<Bitmap>(myWidth, myHeight) {
                    @Override
                    public void onResourceReady(Bitmap resource, GlideAnimation glideAnimation) {
                        iWaitingView.onLoadAvatar(resource);
                    }

                    @Override
                    public void onLoadFailed(Exception e, Drawable errorDrawable) {
                        Bitmap errorBitmap = BitmapFactory.decodeResource(context.getResources(), R.drawable.call_blank_avatar);;
                        iWaitingView.onLoadAvatar(errorBitmap);
                    }
                });
    }

    public static Bitmap drawableToBitmap (Drawable drawable) {
        if (drawable instanceof BitmapDrawable) {
            return ((BitmapDrawable)drawable).getBitmap();
        }

        int width = drawable.getIntrinsicWidth();
        width = width > 0 ? width : 1;
        int height = drawable.getIntrinsicHeight();
        height = height > 0 ? height : 1;

        Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
        drawable.draw(canvas);

        return bitmap;
    }

    @Override
    public void playRingTone() {
        if (ringtone == null) {
            ringtone = MediaPlayer.create(context, R.raw.ringtone);
            ringtone.setAudioStreamType(AudioManager.STREAM_MUSIC);
            ringtone.setLooping(true);
            ringtone.start();
        }
    }

    @Override
    public void stopRingTone() {
        if (ringtone != null && ringtone.isPlaying()) {
            ringtone.stop();
            ringtone.release();
            ringtone = null;
        }
    }

    //Accept appointment
    @Override
    public void answerCall() {
        Intent i = new Intent(context, CallActivity.class);
        i.putExtra("apiKey", apiKey);
        i.putExtra("sessionId", sessionId);
        i.putExtra("token", token);
        i.putExtra("to", to);
        i.putExtra("from", from);
        i.putExtra("message", "answer");
        i.putExtra("fromName", fromName);
        iWaitingView.onResultAnswer(i);
    }

    //Refuse appointment
    @Override
    public void declineCall() {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("from", from);
        params.put("to", to);
        params.put("message", "decline");
        try {
            SocketService.sendData("socket/messageTransfer", params);
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
        iWaitingView.onResultDecline();
    }
}
