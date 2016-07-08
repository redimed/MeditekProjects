/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.model;

import java.util.List;

/**
 *
 * @author rockmanexe1994
 */
public class MailModel {
    String sender;
    List<String> recipient;
    String subject;
    String bodyContent;
    List<NewAttachmentModel> attachments;

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public List<String> getRecipient() {
        return recipient;
    }

    public void setRecipient(List<String> recipient) {
        this.recipient = recipient;
    }

    public String getBodyContent() {
        return bodyContent;
    }

    public void setBodyContent(String bodyContent) {
        this.bodyContent = bodyContent;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public List<NewAttachmentModel> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<NewAttachmentModel> attachments) {
        this.attachments = attachments;
    }
    
}
