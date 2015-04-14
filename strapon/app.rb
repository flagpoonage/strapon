require 'sinatra'
require 'json'

def html(a)
  return File.expand_path(a,settings.public_folder)
end

def jsonfile(a)
  return File.expand_path(a, settings.public_folder + '/data')
end

get '/' do
  return send_file html('index.html')
end

get '/s.json' do
  content_type :json
  return send_file jsonfile('contacts.json')
end