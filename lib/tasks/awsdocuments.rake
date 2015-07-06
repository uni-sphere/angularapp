namespace :awsdocuments_links do
  desc "send"
  task refresh: :environment do
    Awsdocument.refresh_links
  end
end