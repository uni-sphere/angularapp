namespace :awsdocuments do
  desc "send"
  task refresh: :environment do
    Awsdocument.refresh_links
  end
end