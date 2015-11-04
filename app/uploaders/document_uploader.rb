# encoding: utf-8

class DocumentUploader < CarrierWave::Uploader::Base

  # include CarrierWave::RMagick

  storage :fog
  
  include CarrierWave::MimeTypes
  # process :set_content_type
  process :set_content_type_for_strange_format

  def set_content_type_for_strange_format
    f_type = file.content_type
    f_name = file.original_filename
    if f_type.include? "jpeg" or f_type.include? "jpg" or f_name.include? ".jpg" or f_name.include? ".jpeg"
      self.file.instance_variable_set(:@content_type, "application/jpeg")
    elsif f_type.include? "png" or f_name.include? ".png"
      self.file.instance_variable_set(:@content_type, "application/png")
    elsif f_type.include? "pdf" or f_name.include? ".pdf"
      self.file.instance_variable_set(:@content_type, "application/pdf")
    elsif f_type === "" or (!f_name.include? ".pdf" and !f_name.include? ".jpg" and !f_name.include? ".png")
      self.file.instance_variable_set(:@content_type, "binary/octet-stream")
    end
  end
  
  def store_dir
    nil
  end

end
