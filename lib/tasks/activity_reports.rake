namespace :activity_reports do
  desc "send"
  task send: :environment do
    Node.create_reports
  end
end